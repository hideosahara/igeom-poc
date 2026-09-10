/**
 * Classe que representa um ponto no plano cartesiano
 */
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.id = Point.nextId++;
        this.selected = false;
        this.hidden = false;
        this.color = '#2ecc71'; // green
        this.dependents = []; // Objetos que dependem deste ponto
        this.isDependent = false; // Se este ponto depende de outro objeto
        this.parentObject = null; // Objeto do qual este ponto depende
    }

    static nextId = 0;

    /**
     * Calcula a distância entre este ponto e outro
     */
    distance(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Move o ponto para novas coordenadas
     */
    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * Verifica se este ponto é igual a outro (dentro de uma tolerância)
     */
    equals(other, tolerance = 0.001) {
        return Math.abs(this.x - other.x) < tolerance && 
               Math.abs(this.y - other.y) < tolerance;
    }

    /**
     * Cria uma cópia do ponto
     */
    copy() {
        return new Point(this.x, this.y);
    }

    /**
     * Adiciona um objeto dependente
     */
    addDependent(obj) {
        if (!this.dependents.includes(obj)) {
            this.dependents.push(obj);
        }
    }

    /**
     * Remove um objeto dependente
     */
    removeDependent(obj) {
        const index = this.dependents.indexOf(obj);
        if (index > -1) {
            this.dependents.splice(index, 1);
        }
    }

    /**
     * Atualiza este ponto baseado no objeto pai
     */
    updateFromParent() {
        if (this.isDependent && this.parentObject) {
            // Este ponto é calculado dinamicamente
            this.parentObject.updateDependentPoint(this);
        }
    }

    /**
     * Converte para representação JSON
     */
    toJSON() {
        return {
            type: 'Point',
            x: this.x,
            y: this.y,
            id: this.id,
            selected: this.selected,
            hidden: this.hidden,
            color: this.color,
            isDependent: this.isDependent
        };
    }

    /**
     * Cria um ponto a partir de JSON
     */
    static fromJSON(json) {
        const point = new Point(json.x, json.y);
        point.id = json.id;
        point.selected = json.selected;
        point.hidden = json.hidden;
        point.color = json.color;
        point.isDependent = json.isDependent || false;
        return point;
    }
}