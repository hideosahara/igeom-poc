/**
 * Aplicação principal iGeom - Geometria Dinâmica
 */
class IGeomApp {
    constructor() {
        this.canvas = document.getElementById('geometry-canvas');
        this.statusText = document.getElementById('status-text');
        this.coordinatesText = document.getElementById('coordinates');
        
        // Inicializar sistemas
        this.coordinateSystem = new CoordinateSystem(this.canvas.width, this.canvas.height);
        this.renderer = new Renderer(this.canvas, this.coordinateSystem);
        this.collision = new Collision(this.coordinateSystem);
        this.construction = new Construction();
        this.toolManager = new ToolManager();
        
        // Estado temporário para construção
        this.tempObject = null;
        this.firstPoint = null;
        this.selectedForIntersection = null;
        this.draggingObject = null;
        
        // Configurar canvas
        this.setupCanvas();
        
        // Configurar eventos
        this.setupEventListeners();
        
        // Renderizar inicial
        this.render();
        
        this.updateStatus('Pronto - Selecione uma ferramenta');
    }

    /**
     * Configura o canvas
     */
    setupCanvas() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        this.coordinateSystem.resize(this.canvas.width, this.canvas.height);
    }

    /**
     * Configura os event listeners
     */
    setupEventListeners() {
        // Redimensionamento
        window.addEventListener('resize', () => {
            this.setupCanvas();
            this.render();
        });

        // Eventos do canvas
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));

        // Botões de ferramentas
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tool = e.currentTarget.dataset.tool;
                this.setTool(tool);
            });
        });

        // Botões de menu
        document.getElementById('btn-save').addEventListener('click', () => this.saveConstruction());
        document.getElementById('btn-load').addEventListener('click', () => this.loadConstruction());
        document.getElementById('btn-clear').addEventListener('click', () => this.clearConstruction());

        // Input de arquivo
        document.getElementById('file-input').addEventListener('change', (e) => this.handleFileLoad(e));
    }

    /**
     * Define a ferramenta atual
     */
    setTool(tool) {
        this.toolManager.setTool(tool);
        
        // Atualizar UI
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tool === tool) {
                btn.classList.add('active');
            }
        });
        
        // Limpar destaque dos botões de criação
        this.clearButtonHighlights();
        
        // Verificar se podemos criar objeto a partir de seleção
        if (this.toolManager.canCreateFromSelection()) {
            if (tool === 'intersection' && this.construction.hasTwoSelectedNonPoints()) {
                const objects = this.construction.getTwoSelectedNonPoints();
                this.createIntersectionFromSelection(objects[0], objects[1]);
                // Voltar para seleção após criar
                this.toolManager.setTool('select');
                document.querySelectorAll('.tool-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.tool === 'select') {
                        btn.classList.add('active');
                    }
                });
                this.construction.deselectAll();
                this.updateSelectionStatus();
                this.render();
                return;
            } else if (this.construction.hasTwoSelectedPoints()) {
                const points = this.construction.getTwoSelectedPoints();
                this.createObjectFromSelection(tool, points[0], points[1]);
                // Voltar para seleção após criar
                this.toolManager.setTool('select');
                document.querySelectorAll('.tool-btn').forEach(btn => {
                    btn.classList.remove('active');
                    if (btn.dataset.tool === 'select') {
                        btn.classList.add('active');
                    }
                });
                this.construction.deselectAll();
                this.updateSelectionStatus();
                this.render();
                return;
            }
        }
        
        // Limpar estado temporário (mas não deselecionar se vamos criar de seleção)
        this.clearTempState(tool);
        
        this.updateStatus(`Ferramenta: ${this.toolManager.getToolName()}`);
        this.render();
    }

    /**
     * Limpa o destaque dos botões de criação
     */
    clearButtonHighlights() {
        const buttons = ['line', 'segment', 'ray', 'intersection'];
        buttons.forEach(tool => {
            const btn = document.querySelector(`[data-tool="${tool}"]`);
            if (btn) {
                btn.style.borderColor = '';
                btn.style.borderWidth = '';
            }
        });
    }

    /**
     * Limpa o estado temporário
     */
    clearTempState(keepSelection = false) {
        this.tempObject = null;
        this.firstPoint = null;
        this.selectedForIntersection = null;
        this.draggingObject = null;
        if (!keepSelection) {
            this.construction.deselectAll();
            this.clearButtonHighlights();
        }
    }

    /**
     * Cria objeto a partir de dois pontos selecionados
     */
    createObjectFromSelection(tool, pointA, pointB) {
        let obj;
        switch (tool) {
            case 'line':
                obj = new Line(pointA, pointB);
                break;
            case 'segment':
                obj = new Segment(pointA, pointB);
                break;
            case 'ray':
                obj = new Ray(pointA, pointB);
                break;
        }
        
        if (obj && obj.isWellDefined()) {
            this.construction.addObject(obj);
            this.updateStatus(`${this.toolManager.getToolName()} criada a partir de pontos selecionados`);
        }
    }

    /**
     * Cria interseção a partir de dois objetos selecionados
     */
    createIntersectionFromSelection(obj1, obj2) {
        console.log('Criando interseção entre:', obj1, obj2);
        const intersections = Intersection.intersect(obj1, obj2);
        console.log('Interseções calculadas:', intersections);
        
        if (intersections.length === 0) {
            this.updateStatus('Os objetos selecionados não se intersectam');
            return;
        }
        
        let intersectionIndex = 1;
        intersections.forEach(point => {
            console.log('Criando ponto de interseção:', point);
            // Criar IntersectionPoint em vez de Point normal
            const intersectionPoint = new IntersectionPoint(
                obj1, 
                obj2, 
                intersectionIndex++
            );
            console.log('IntersectionPoint criado:', intersectionPoint);
            this.construction.addObject(intersectionPoint);
        });
        
        this.updateStatus(`${intersections.length} ponto(s) de interseção dinâmico(s) criado(s)`);
    }

    /**
     * Manipula o evento de mouse down
     */
    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const tool = this.toolManager.getTool();
        
        if (this.toolManager.isConstructionTool()) {
            this.handleConstructionClick(x, y, tool);
        } else if (this.toolManager.isSelectionTool()) {
            this.handleSelectionClick(x, y, e.ctrlKey || e.metaKey);
        } else if (this.toolManager.isMoveTool()) {
            this.handleMoveClick(x, y);
        } else if (this.toolManager.isHideTool()) {
            this.handleHideClick(x, y);
        } else if (this.toolManager.isIntersectionTool()) {
            this.handleIntersectionClick(x, y);
        }
        
        this.render();
    }

    /**
     * Manipula clique de construção
     */
    handleConstructionClick(x, y, tool) {
        const cartesian = this.coordinateSystem.toCartesian(x, y);
        const point = new Point(cartesian.x, cartesian.y);
        
        // Verificar se clicou em um ponto existente
        const existingPoint = this.collision.findPointAt(x, y, this.construction);
        
        if (tool === 'point') {
            const finalPoint = existingPoint || point;
            
            // Se clicou em outro objeto, criar ponto em cima dele
            const objAt = this.collision.findObjectAt(x, y, this.construction);
            if (objAt && !existingPoint) {
                // Ponto fixo em objeto (similar ao PontoTremDinamico)
                finalPoint.onObject = objAt;
            }
            
            this.construction.addObject(finalPoint);
            this.updateStatus('Ponto criado');
        } else if (['line', 'segment', 'ray', 'circle'].includes(tool)) {
            if (!this.firstPoint) {
                // Primeiro clique
                this.firstPoint = existingPoint || point;
                if (!existingPoint) {
                    this.construction.addObject(this.firstPoint);
                }
                this.updateStatus('Clique no segundo ponto');
            } else {
                // Segundo clique
                const secondPoint = existingPoint || point;
                if (!existingPoint) {
                    this.construction.addObject(secondPoint);
                }
                
                let obj;
                switch (tool) {
                    case 'line':
                        obj = new Line(this.firstPoint, secondPoint);
                        break;
                    case 'segment':
                        obj = new Segment(this.firstPoint, secondPoint);
                        break;
                    case 'ray':
                        obj = new Ray(this.firstPoint, secondPoint);
                        break;
                    case 'circle':
                        obj = new Circle(this.firstPoint, secondPoint);
                        break;
                }
                
                if (obj && obj.isWellDefined()) {
                    this.construction.addObject(obj);
                    this.updateStatus(`${this.toolManager.getToolName()} criada`);
                }
                
                this.firstPoint = null;
            }
        }
    }

    /**
     * Manipula clique de seleção
     */
    handleSelectionClick(x, y, multiSelect = false) {
        const obj = this.collision.findObjectAt(x, y, this.construction);
        
        if (obj) {
            if (multiSelect) {
                // Seleção múltipla com Ctrl/Cmd
                if (obj.selected) {
                    this.construction.deselectObject(obj);
                } else {
                    this.construction.selectObject(obj);
                }
            } else {
                // Seleção normal - limpa seleção anterior
                if (obj.selected) {
                    this.construction.deselectObject(obj);
                } else {
                    this.construction.deselectAll();
                    this.construction.selectObject(obj);
                }
            }
        } else {
            this.construction.deselectAll();
        }
        
        this.updateSelectionStatus();
        this.highlightCreateButtons();
    }

    /**
     * Atualiza o status baseado na seleção atual
     */
    updateSelectionStatus() {
        const selectedPoints = this.construction.getSelectedPoints();
        const selectedNonPoints = this.construction.getSelectedNonPoints();
        const totalSelected = this.construction.selectedObjects.length;
        
        if (totalSelected === 0) {
            this.updateStatus('Seleção limpa');
        } else if (selectedPoints.length === 1 && selectedNonPoints.length === 0) {
            this.updateStatus('1 ponto selecionado - selecione outro ponto (use Ctrl/Cmd para seleção múltipla)');
        } else if (selectedPoints.length === 2 && selectedNonPoints.length === 0) {
            this.updateStatus('2 pontos selecionados - clique em Reta, Segmento ou Semireta para criar');
        } else if (selectedNonPoints.length === 1 && selectedPoints.length === 0) {
            this.updateStatus('1 objeto selecionado - selecione outro objeto para criar interseção');
        } else if (selectedNonPoints.length === 2 && selectedPoints.length === 0) {
            this.updateStatus('2 objetos selecionados - clique em Interseção para criar pontos de interseção');
        } else {
            this.updateStatus(`${totalSelected} objeto(s) selecionado(s) - deselecione para ter apenas 2 do mesmo tipo`);
        }
    }

    /**
     * Destaca os botões de criação quando 2 pontos ou 2 objetos estão selecionados
     */
    highlightCreateButtons() {
        const selectedPoints = this.construction.getSelectedPoints();
        const selectedNonPoints = this.construction.getSelectedNonPoints();
        
        // Destacar botões de reta/segmento/semireta quando 2 pontos estão selecionados
        const canCreateFromPoints = selectedPoints.length === 2;
        const pointButtons = ['line', 'segment', 'ray'];
        pointButtons.forEach(tool => {
            const btn = document.querySelector(`[data-tool="${tool}"]`);
            if (btn) {
                if (canCreateFromPoints) {
                    btn.style.borderColor = '#27ae60';
                    btn.style.borderWidth = '3px';
                } else {
                    btn.style.borderColor = '';
                    btn.style.borderWidth = '';
                }
            }
        });
        
        // Destacar botão de interseção quando 2 objetos não-pontos estão selecionados
        const canCreateIntersection = selectedNonPoints.length === 2;
        const intersectionBtn = document.querySelector(`[data-tool="intersection"]`);
        if (intersectionBtn) {
            if (canCreateIntersection) {
                intersectionBtn.style.borderColor = '#27ae60';
                intersectionBtn.style.borderWidth = '3px';
            } else {
                intersectionBtn.style.borderColor = '';
                intersectionBtn.style.borderWidth = '';
            }
        }
    }

    /**
     * Manipula clique de movimento
     */
    handleMoveClick(x, y) {
        const obj = this.collision.findObjectAt(x, y, this.construction);
        
        if (obj instanceof Point) {
            if (obj.isDependent) {
                this.updateStatus('Este ponto não pode ser movido (depende de outros objetos)');
            } else {
                this.draggingObject = obj;
                this.updateStatus('Arraste o ponto - objetos dependentes serão atualizados');
            }
        } else {
            this.updateStatus('Selecione um ponto para mover');
        }
    }

    /**
     * Manipula clique de esconder
     */
    handleHideClick(x, y) {
        const obj = this.collision.findObjectAt(x, y, this.construction);
        
        if (obj) {
            this.construction.selectObject(obj);
            this.construction.hideSelected();
            this.updateStatus('Objeto escondido');
        }
    }

    /**
     * Manipula clique de interseção
     */
    handleIntersectionClick(x, y) {
        const obj = this.collision.findObjectAt(x, y, this.construction);
        
        if (!obj) return;
        
        if (!this.selectedForIntersection) {
            // Primeiro objeto selecionado
            this.selectedForIntersection = obj;
            obj.selected = true;
            this.updateStatus('Selecione o segundo objeto');
        } else {
            // Segundo objeto selecionado - calcular interseção
            const intersections = Intersection.intersect(this.selectedForIntersection, obj);
            
            let intersectionIndex = 1;
            intersections.forEach(point => {
                // Criar IntersectionPoint em vez de Point normal
                const intersectionPoint = new IntersectionPoint(
                    this.selectedForIntersection, 
                    obj, 
                    intersectionIndex++
                );
                this.construction.addObject(intersectionPoint);
            });
            
            this.selectedForIntersection.selected = false;
            this.selectedForIntersection = null;
            
            this.updateStatus(`${intersections.length} ponto(s) de interseção dinâmico(s) criado(s)`);
        }
    }

    /**
     * Manipula o evento de mouse move
     */
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Atualizar coordenadas
        const cartesian = this.coordinateSystem.toCartesian(x, y);
        this.coordinatesText.textContent = `X: ${cartesian.x.toFixed(1)}, Y: ${cartesian.y.toFixed(1)}`;
        
        // Arrastar ponto
        if (this.draggingObject && this.toolManager.isMoveTool()) {
            this.construction.movePoint(this.draggingObject, cartesian.x, cartesian.y);
            this.render();
            return;
        }
        
        // Preview de construção
        if (this.firstPoint && this.toolManager.isConstructionTool()) {
            const tool = this.toolManager.getTool();
            const cartesian = this.coordinateSystem.toCartesian(x, y);
            const secondPoint = new Point(cartesian.x, cartesian.y);
            
            let tempObj;
            switch (tool) {
                case 'line':
                    tempObj = new Line(this.firstPoint, secondPoint);
                    break;
                case 'segment':
                    tempObj = new Segment(this.firstPoint, secondPoint);
                    break;
                case 'ray':
                    tempObj = new Ray(this.firstPoint, secondPoint);
                    break;
                case 'circle':
                    tempObj = new Circle(this.firstPoint, secondPoint);
                    break;
            }
            
            this.tempObject = tempObj;
            this.render();
        }
    }

    /**
     * Manipula o evento de mouse up
     */
    handleMouseUp(e) {
        if (this.draggingObject) {
            this.draggingObject = null;
            this.updateStatus('Ponto movido');
        }
    }

    /**
     * Manipula o evento de mouse leave
     */
    handleMouseLeave(e) {
        this.draggingObject = null;
    }

    /**
     * Renderiza a cena
     */
    render() {
        this.renderer.drawConstruction(this.construction);
        
        // Desenhar objeto temporário (preview)
        if (this.tempObject) {
            if (this.tempObject instanceof Line) {
                this.renderer.drawLine(this.tempObject);
            } else if (this.tempObject instanceof Segment) {
                this.renderer.drawSegment(this.tempObject);
            } else if (this.tempObject instanceof Ray) {
                this.renderer.drawRay(this.tempObject);
            } else if (this.tempObject instanceof Circle) {
                this.renderer.drawCircle(this.tempObject);
            }
        }
    }

    /**
     * Atualiza o status
     */
    updateStatus(message) {
        this.statusText.textContent = message;
    }

    /**
     * Salva a construção
     */
    saveConstruction() {
        const json = this.construction.toJSON();
        const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'igeom-construction.json';
        a.click();
        
        URL.revokeObjectURL(url);
        this.updateStatus('Construção salva');
    }

    /**
     * Carrega uma construção
     */
    loadConstruction() {
        document.getElementById('file-input').click();
    }

    /**
     * Manipula o carregamento de arquivo
     */
    handleFileLoad(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target.result);
                this.construction = Construction.fromJSON(json);
                this.clearTempState();
                this.render();
                this.updateStatus('Construção carregada');
            } catch (error) {
                console.error('Erro ao carregar arquivo:', error);
                this.updateStatus('Erro ao carregar arquivo');
            }
        };
        reader.readAsText(file);
        
        // Limpar o input
        e.target.value = '';
    }

    /**
     * Limpa a construção
     */
    clearConstruction() {
        if (confirm('Tem certeza que deseja limpar toda a construção?')) {
            this.construction.clear();
            this.clearTempState();
            this.render();
            this.updateStatus('Construção limpa');
        }
    }
}

// Inicializar a aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    window.igeomApp = new IGeomApp();
});