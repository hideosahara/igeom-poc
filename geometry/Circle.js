/**
 * Classe que representa uma circunferência no plano cartesiano
 * Uma circunferência é definida por um centro e um ponto na circunferência
 */
class Circle {
    constructor(center, pointOnCircumference) {
        this.center = center;
        this.pointOnCircumference = pointOnCircumference;
        this.id = Circle.nextId++;
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
        if (this.center) {
            this.center.addDependent(this);
        }
        if (this.pointOnCircumference) {
            this.pointOnCircumference.addDependent(this);
        }
    }

    /**
     * Atualiza os pontos da circunferência
     */
    updatePoints(center, pointOnCircumference) {
        // Remover dependências antigas
        if (this.center) {
            this.center.removeDependent(this);
        }
        if (this.pointOnCircumference) {
            this.pointOnCircumference.removeDependent(this);
        }
        
        this.center = center;
        this.pointOnCircumference = pointOnCircumference;
        
        // Adicionar novas dependências
        this.setupDependencies();
    }

    /**
     * Atualiza um ponto dependente quando um dos pontos é movido
     */
    updateDependentPoint(dependentPoint) {
        // Para circunferências, não há pontos dependentes que precisam ser atualizados
    }

    /**
     * Notifica este objeto que um de seus pontos foi movido
     */
    notifyPointMoved(movedPoint) {
        // A circunferência não precisa fazer nada especial quando um ponto é movido
    }

    /**
     * Calcula o raio da circunferência
     */
    get radius() {
        return this.center.distance(this.pointOnCircumference);
    }

    /**
     * Calcula a distância de um ponto à circunferência
     */
    distanceToPoint(point) {
        const distanceToCenter = point.distance(this.center);
        return Math.abs(distanceToCenter - this.radius);
    }

    /**
     * Verifica se um ponto pertence à circunferência (dentro de uma tolerância)
     */
    containsPoint(point, tolerance = 0.1) {
        return this.distanceToPoint(point) < tolerance;
    }

    /**
     * Verifica se a circunferência está bem definida (raio > 0)
     */
    isWellDefined() {
        return this.radius > 0.001;
    }

    /**
     * Converte para representação JSON
     */
    toJSON() {
        return {
            type: 'Circle',
            center: this.center.toJSON(),
            pointOnCircumference: this.pointOnCircumference.toJSON(),
            id: this.id,
            selected: this.selected,
            hidden: this.hidden,
            color: this.color
        };
    }

    /**
     * Cria uma circunferência a partir de JSON
     */
    static fromJSON(json) {
        const circle = new Circle(
            Point.fromJSON(json.center),
            Point.fromJSON(json.pointOnCircumference)
        );
        circle.id = json.id;
        circle.selected = json.selected;
        circle.hidden = json.hidden;
        circle.color = json.color;
        return circle;
    }
}