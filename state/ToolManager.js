/**
 * Gerencia as ferramentas de construção
 */
class ToolManager {
    constructor() {
        this.currentTool = 'select';
        this.tools = {
            select: 'Selecionar',
            point: 'Criar Ponto',
            line: 'Criar Reta',
            segment: 'Criar Segmento',
            ray: 'Criar Semireta',
            circle: 'Criar Circunferência',
            intersection: 'Interseção',
            move: 'Mover',
            hide: 'Esconder'
        };
    }

    /**
     * Define a ferramenta atual
     */
    setTool(tool) {
        if (this.tools[tool]) {
            this.currentTool = tool;
            return true;
        }
        return false;
    }

    /**
     * Retorna a ferramenta atual
     */
    getTool() {
        return this.currentTool;
    }

    /**
     * Retorna o nome da ferramenta atual
     */
    getToolName() {
        return this.tools[this.currentTool];
    }

    /**
     * Verifica se a ferramenta atual é de construção
     */
    isConstructionTool() {
        return ['point', 'line', 'segment', 'ray', 'circle', 'intersection'].includes(this.currentTool);
    }

    /**
     * Verifica se a ferramenta atual é de seleção
     */
    isSelectionTool() {
        return this.currentTool === 'select';
    }

    /**
     * Verifica se a ferramenta atual é de movimento
     */
    isMoveTool() {
        return this.currentTool === 'move';
    }

    /**
     * Verifica se a ferramenta atual é de esconder
     */
    isHideTool() {
        return this.currentTool === 'hide';
    }

    /**
     * Verifica se a ferramenta atual é de interseção
     */
    isIntersectionTool() {
        return this.currentTool === 'intersection';
    }

    /**
     * Verifica se a ferramenta atual requer dois pontos
     */
    requiresTwoPoints() {
        return ['line', 'segment', 'ray'].includes(this.currentTool);
    }

    /**
     * Verifica se a ferramenta atual pode criar objeto a partir de seleção
     */
    canCreateFromSelection() {
        return ['line', 'segment', 'ray', 'intersection'].includes(this.currentTool);
    }
}