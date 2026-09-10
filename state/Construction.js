/**
 * Gerencia a construção geométrica (estado dos objetos)
 */
class Construction {
    constructor() {
        this.objects = [];
        this.selectedObjects = [];
    }

    /**
     * Adiciona um objeto à construção
     */
    addObject(obj) {
        console.log('Adicionando objeto à construção:', obj, 'Tipo:', obj.constructor.name);
        this.objects.push(obj);
        console.log('Total de objetos na construção:', this.objects.length);
    }

    /**
     * Remove um objeto da construção
     */
    removeObject(obj) {
        const index = this.objects.indexOf(obj);
        if (index > -1) {
            this.objects.splice(index, 1);
        }
    }

    /**
     * Limpa todos os objetos
     */
    clear() {
        this.objects = [];
        this.selectedObjects = [];
    }

    /**
     * Seleciona um objeto
     */
    selectObject(obj) {
        if (!this.selectedObjects.includes(obj)) {
            this.selectedObjects.push(obj);
            obj.selected = true;
        }
    }

    /**
     * Deseleciona um objeto
     */
    deselectObject(obj) {
        const index = this.selectedObjects.indexOf(obj);
        if (index > -1) {
            this.selectedObjects.splice(index, 1);
            obj.selected = false;
        }
    }

    /**
     * Seleciona todos os objetos
     */
    selectAll() {
        this.objects.forEach(obj => {
            if (!obj.hidden) {
                this.selectObject(obj);
            }
        });
    }

    /**
     * Deseleciona todos os objetos
     */
    deselectAll() {
        this.selectedObjects.forEach(obj => {
            obj.selected = false;
        });
        this.selectedObjects = [];
    }

    /**
     * Esconde os objetos selecionados
     */
    hideSelected() {
        this.selectedObjects.forEach(obj => {
            obj.hidden = true;
            obj.selected = false;
        });
        this.selectedObjects = [];
    }

    /**
     * Mostra todos os objetos
     */
    showAll() {
        this.objects.forEach(obj => {
            obj.hidden = false;
        });
    }

    /**
     * Move um ponto para novas coordenadas e atualiza todos os dependentes
     */
    movePoint(point, newX, newY) {
        if (point.isDependent) {
            // Não move pontos dependentes manualmente
            return;
        }
        
        point.moveTo(newX, newY);
        
        // Atualizar todos os objetos dependentes em cascata
        this.updateDependents(point);
    }

    /**
     * Atualiza todos os objetos dependentes de um ponto
     */
    updateDependents(point) {
        const visited = new Set();
        const queue = [...point.dependents];
        
        while (queue.length > 0) {
            const obj = queue.shift();
            
            if (visited.has(obj)) continue;
            visited.add(obj);
            
            // Notificar o objeto que um ponto foi movido
            if (obj.notifyPointMoved) {
                obj.notifyPointMoved(point);
            }
            
            // Se o objeto tiver pontos dependentes, atualizá-los
            if (obj instanceof Point) {
                obj.updateFromParent();
                
                // Adicionar dependentes deste ponto à fila
                obj.dependents.forEach(dep => {
                    if (!visited.has(dep)) {
                        queue.push(dep);
                    }
                });
            } else {
                // Para outros objetos (linhas, círculos, etc.), verificar se têm pontos dependentes
                this.objects.forEach(otherObj => {
                    if (otherObj instanceof Point && otherObj.isDependent) {
                        if (otherObj.parentObject === obj || 
                            (otherObj.obj1 === obj || otherObj.obj2 === obj)) {
                            otherObj.updateFromParent();
                            
                            // Adicionar dependentes deste ponto à fila
                            otherObj.dependents.forEach(dep => {
                                if (!visited.has(dep)) {
                                    queue.push(dep);
                                }
                            });
                        }
                    }
                });
            }
        }
    }

    /**
     * Reconstrói as referências dos pontos de interseção após carregar
     */
    rebuildIntersectionReferences() {
        this.objects.forEach(obj => {
            if (obj instanceof IntersectionPoint) {
                obj.rebuildReferences(this);
            }
        });
    }

    /**
     * Retorna todos os pontos
     */
    getPoints() {
        return this.objects.filter(obj => obj instanceof Point);
    }

    /**
     * Retorna apenas os pontos selecionados
     */
    getSelectedPoints() {
        return this.selectedObjects.filter(obj => obj instanceof Point);
    }

    /**
     * Retorna todos os objetos exceto pontos
     */
    getOtherObjects() {
        return this.objects.filter(obj => !(obj instanceof Point));
    }

    /**
     * Verifica se tem exatamente 2 pontos selecionados
     */
    hasTwoSelectedPoints() {
        const selectedPoints = this.getSelectedPoints();
        return selectedPoints.length === 2;
    }

    /**
     * Retorna os 2 pontos selecionados (se existirem)
     */
    getTwoSelectedPoints() {
        const selectedPoints = this.getSelectedPoints();
        if (selectedPoints.length === 2) {
            return selectedPoints;
        }
        return null;
    }

    /**
     * Retorna apenas os objetos selecionados que não são pontos
     */
    getSelectedNonPoints() {
        return this.selectedObjects.filter(obj => !(obj instanceof Point));
    }

    /**
     * Verifica se tem exatamente 2 objetos não-pontos selecionados
     */
    hasTwoSelectedNonPoints() {
        const selectedNonPoints = this.getSelectedNonPoints();
        return selectedNonPoints.length === 2;
    }

    /**
     * Retorna os 2 objetos não-pontos selecionados (se existirem)
     */
    getTwoSelectedNonPoints() {
        const selectedNonPoints = this.getSelectedNonPoints();
        if (selectedNonPoints.length === 2) {
            return selectedNonPoints;
        }
        return null;
    }

    /**
     * Converte para JSON
     */
    toJSON() {
        return {
            objects: this.objects.map(obj => obj.toJSON())
        };
    }

    /**
     * Carrega de JSON
     */
    static fromJSON(json) {
        const construction = new Construction();
        
        json.objects.forEach(objJson => {
            let obj;
            switch (objJson.type) {
                case 'Point':
                    obj = Point.fromJSON(objJson);
                    break;
                case 'IntersectionPoint':
                    obj = IntersectionPoint.fromJSON(objJson);
                    break;
                case 'Line':
                    obj = Line.fromJSON(objJson);
                    break;
                case 'Segment':
                    obj = Segment.fromJSON(objJson);
                    break;
                case 'Ray':
                    obj = Ray.fromJSON(objJson);
                    break;
                case 'Circle':
                    obj = Circle.fromJSON(objJson);
                    break;
                default:
                    console.warn('Tipo desconhecido:', objJson.type);
                    return;
            }
            construction.addObject(obj);
        });
        
        // Reconstruir referências de pontos de interseção
        construction.rebuildIntersectionReferences();
        
        return construction;
    }
}