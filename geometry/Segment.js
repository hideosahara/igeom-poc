/**
 * Classe que representa um segmento de reta no plano cartesiano
 * Um segmento é definido por dois pontos extremos
 */
class Segment {
    constructor(pointA, pointB) {
        this.pointA = pointA;
        this.pointB = pointB;
        this.id = Segment.nextId++;
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
     * Atualiza os pontos do segmento
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
        // Para segmentos, não há pontos dependentes que precisam ser atualizados
    }

    /**
     * Notifica este objeto que um de seus pontos foi movido
     */
    notifyPointMoved(movedPoint) {
        // O segmento não precisa fazer nada especial quando um ponto é movido
    }

    /**
     * Calcula o comprimento do segmento
     */
    get length() {
        return this.pointA.distance(this.pointB);
    }

    /**
     * Calcula a distância de um ponto ao segmento
     */
    distanceToPoint(point) {
        const A = this.pointA;
        const B = this.pointB;
        
        // Verifica se a projeção do ponto está dentro do segmento
        const AB = { x: B.x - A.x, y: B.y - A.y };
        const AP = { x: point.x - A.x, y: point.y - A.y };
        
        const ab2 = AB.x * AB.x + AB.y * AB.y;
        const ap_ab = AP.x * AB.x + AP.y * AB.y;
        
        if (ab2 === 0) return A.distance(point);
        
        const t = Math.max(0, Math.min(1, ap_ab / ab2));
        
        // Ponto mais próximo no segmento
        const closestX = A.x + t * AB.x;
        const closestY = A.y + t * AB.y;
        
        return Math.sqrt(Math.pow(point.x - closestX, 2) + Math.pow(point.y - closestY, 2));
    }

    /**
     * Verifica se um ponto pertence ao segmento (dentro de uma tolerância)
     */
    containsPoint(point, tolerance = 0.1) {
        return this.distanceToPoint(point) < tolerance;
    }

    /**
     * Verifica se o segmento está bem definido (pontos não coincidentes)
     */
    isWellDefined() {
        return !this.pointA.equals(this.pointB);
    }

    /**
     * Converte para representação JSON
     */
    toJSON() {
        return {
            type: 'Segment',
            pointA: this.pointA.toJSON(),
            pointB: this.pointB.toJSON(),
            id: this.id,
            selected: this.selected,
            hidden: this.hidden,
            color: this.color
        };
    }

    /**
     * Cria um segmento a partir de JSON
     */
    static fromJSON(json) {
        const segment = new Segment(
            Point.fromJSON(json.pointA),
            Point.fromJSON(json.pointB)
        );
        segment.id = json.id;
        segment.selected = json.selected;
        segment.hidden = json.hidden;
        segment.color = json.color;
        return segment;
    }
}