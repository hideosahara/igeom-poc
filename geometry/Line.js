/**
 * Classe que representa uma reta no plano cartesiano
 * Uma reta é definida por dois pontos
 */
class Line {
    constructor(pointA, pointB) {
        this.pointA = pointA;
        this.pointB = pointB;
        this.id = Line.nextId++;
        this.selected = false;
        this.hidden = false;
        this.color = '#3498db'; // blue
        
        // Registrar dependências
        this.setupDependencies();
    }

    static nextId = 0;

    /**
     * Configura as dependências entre pontos e este objeto
     */
    setupDependencies() {
        if (this.pointA) {
            this.pointA.addDependent(this);
        }
        if (this.pointB) {
            this.pointB.addDependent(this);
        }
    }

    /**
     * Atualiza os pontos da reta
     */
    updatePoints(pointA, pointB) {
        // Remover dependências antigas
        if (this.pointA) {
            this.pointA.removeDependent(this);
        }
        if (this.pointB) {
            this.pointB.removeDependent(this);
        }
        
        this.pointA = pointA;
        this.pointB = pointB;
        
        // Adicionar novas dependências
        this.setupDependencies();
    }

    /**
     * Atualiza um ponto dependente quando um dos pontos é movido
     */
    updateDependentPoint(dependentPoint) {
        // Para retas, não há pontos dependentes que precisam ser atualizados
        // Esta método é usado por pontos que dependem deste objeto
    }

    /**
     * Notifica este objeto que um de seus pontos foi movido
     */
    notifyPointMoved(movedPoint) {
        // A reta não precisa fazer nada especial quando um ponto é movido
        // Ela automaticamente usa a nova posição do ponto
    }

    /**
     * Calcula a distância de um ponto à reta
     */
    distanceToPoint(point) {
        const A = this.pointA;
        const B = this.pointB;
        
        // Fórmula da distância de ponto a reta
        const numerator = Math.abs((B.y - A.y) * point.x - (B.x - A.x) * point.y + B.x * A.y - B.y * A.x);
        const denominator = Math.sqrt(Math.pow(B.y - A.y, 2) + Math.pow(B.x - A.x, 2));
        
        if (denominator === 0) return A.distance(point);
        return numerator / denominator;
    }

    /**
     * Verifica se um ponto pertence à reta (dentro de uma tolerância)
     */
    containsPoint(point, tolerance = 0.1) {
        return this.distanceToPoint(point) < tolerance;
    }

    /**
     * Verifica se a reta está bem definida (pontos não coincidentes)
     */
    isWellDefined() {
        return !this.pointA.equals(this.pointB);
    }

    /**
     * Converte para representação JSON
     */
    toJSON() {
        return {
            type: 'Line',
            pointA: this.pointA.toJSON(),
            pointB: this.pointB.toJSON(),
            id: this.id,
            selected: this.selected,
            hidden: this.hidden,
            color: this.color
        };
    }

    /**
     * Cria uma reta a partir de JSON
     */
    static fromJSON(json) {
        const line = new Line(
            Point.fromJSON(json.pointA),
            Point.fromJSON(json.pointB)
        );
        line.id = json.id;
        line.selected = json.selected;
        line.hidden = json.hidden;
        line.color = json.color;
        return line;
    }
}