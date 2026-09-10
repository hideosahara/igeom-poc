/**
 * Classe que representa uma semireta no plano cartesiano
 * Uma semireta é definida por um ponto inicial e um ponto que indica a direção
 */
class Ray {
    constructor(origin, directionPoint) {
        this.origin = origin;
        this.directionPoint = directionPoint;
        this.id = Ray.nextId++;
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
        if (this.origin) {
            this.origin.addDependent(this);
        }
        if (this.directionPoint) {
            this.directionPoint.addDependent(this);
        }
    }

    /**
     * Atualiza os pontos da semireta
     */
    updatePoints(origin, directionPoint) {
        // Remover dependências antigas
        if (this.origin) {
            this.origin.removeDependent(this);
        }
        if (this.directionPoint) {
            this.directionPoint.removeDependent(this);
        }
        
        this.origin = origin;
        this.directionPoint = directionPoint;
        
        // Adicionar novas dependências
        this.setupDependencies();
    }

    /**
     * Atualiza um ponto dependente quando um dos pontos é movido
     */
    updateDependentPoint(dependentPoint) {
        // Para semiretas, não há pontos dependentes que precisam ser atualizados
    }

    /**
     * Notifica este objeto que um de seus pontos foi movido
     */
    notifyPointMoved(movedPoint) {
        // A semireta não precisa fazer nada especial quando um ponto é movido
    }

    /**
     * Calcula a distância de um ponto à semireta
     */
    distanceToPoint(point) {
        const O = this.origin;
        const D = this.directionPoint;
        
        // Vetor direção
        const dirX = D.x - O.x;
        const dirY = D.y - O.y;
        
        // Vetor do ponto origem ao ponto
        const toPointX = point.x - O.x;
        const toPointY = point.y - O.y;
        
        // Produto escalar para projetar
        const dot = dirX * toPointX + dirY * toPointY;
        const dirLength2 = dirX * dirX + dirY * dirY;
        
        if (dirLength2 === 0) return O.distance(point);
        
        const t = dot / dirLength2;
        
        // Se t < 0, o ponto está "atrás" da origem
        if (t < 0) {
            return O.distance(point);
        }
        
        // Ponto mais próximo na semireta
        const closestX = O.x + t * dirX;
        const closestY = O.y + t * dirY;
        
        return Math.sqrt(Math.pow(point.x - closestX, 2) + Math.pow(point.y - closestY, 2));
    }

    /**
     * Verifica se um ponto pertence à semireta (dentro de uma tolerância)
     */
    containsPoint(point, tolerance = 0.1) {
        return this.distanceToPoint(point) < tolerance;
    }

    /**
     * Verifica se a semireta está bem definida (pontos não coincidentes)
     */
    isWellDefined() {
        return !this.origin.equals(this.directionPoint);
    }

    /**
     * Converte para representação JSON
     */
    toJSON() {
        return {
            type: 'Ray',
            origin: this.origin.toJSON(),
            directionPoint: this.directionPoint.toJSON(),
            id: this.id,
            selected: this.selected,
            hidden: this.hidden,
            color: this.color
        };
    }

    /**
     * Cria uma semireta a partir de JSON
     */
    static fromJSON(json) {
        const ray = new Ray(
            Point.fromJSON(json.origin),
            Point.fromJSON(json.directionPoint)
        );
        ray.id = json.id;
        ray.selected = json.selected;
        ray.hidden = json.hidden;
        ray.color = json.color;
        return ray;
    }
}