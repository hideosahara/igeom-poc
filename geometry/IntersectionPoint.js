/**
 * Classe que representa um ponto de interseção entre dois objetos
 * Este ponto é calculado dinamicamente quando os objetos se movem
 */
class IntersectionPoint extends Point {
    constructor(obj1, obj2, intersectionIndex = 1) {
        // Inicialmente coloca em (0,0), será atualizado
        super(0, 0);
        
        this.obj1 = obj1;
        this.obj2 = obj2;
        this.intersectionIndex = intersectionIndex; // 1 ou 2 para múltiplas interseções
        this.isDependent = true;
        this.parentObject = null; // Não tem um único pai, depende de dois objetos
        
        // Calcular posição inicial
        this.updatePosition();
        
        // Registrar dependências
        this.setupDependencies();
    }

    static nextId = 0;

    /**
     * Configura as dependências
     */
    setupDependencies() {
        if (this.obj1) {
            this.obj1.addDependent(this);
        }
        if (this.obj2) {
            this.obj2.addDependent(this);
        }
    }

    /**
     * Atualiza a posição do ponto baseada na interseção atual
     */
    updatePosition() {
        console.log('Atualizando posição do IntersectionPoint', this.id);
        console.log('Obj1:', this.obj1, 'Obj2:', this.obj2);
        
        if (!this.obj1 || !this.obj2) {
            console.log('Objetos não definidos, não é possível atualizar');
            return;
        }
        
        const intersections = Intersection.intersect(this.obj1, this.obj2);
        console.log('Interseções encontradas:', intersections);
        
        if (intersections.length > 0) {
            const index = Math.min(this.intersectionIndex - 1, intersections.length - 1);
            const intersection = intersections[index];
            console.log('Movendo para:', intersection);
            this.moveTo(intersection.x, intersection.y);
        } else {
            console.log('Nenhuma interseção encontrada');
        }
    }

    /**
     * Sobrescreve moveTo para evitar movimento manual de pontos dependentes
     */
    moveTo(x, y) {
        if (!this.isDependent) {
            super.moveTo(x, y);
        }
        // Se for dependente, ignora movimento manual
    }

    /**
     * Atualiza este ponto quando um dos objetos pai muda
     */
    updateFromParent() {
        this.updatePosition();
    }

    /**
     * Remove dependências quando o ponto é removido
     */
    cleanup() {
        if (this.obj1) {
            this.obj1.removeDependent(this);
        }
        if (this.obj2) {
            this.obj2.removeDependent(this);
        }
    }

    /**
     * Converte para representação JSON
     */
    toJSON() {
        const json = super.toJSON();
        json.type = 'IntersectionPoint';
        json.obj1Id = this.obj1 ? this.obj1.id : null;
        json.obj2Id = this.obj2 ? this.obj2.id : null;
        json.intersectionIndex = this.intersectionIndex;
        return json;
    }

    /**
     * Cria um ponto de interseção a partir de JSON
     * Nota: Requer reconstrução das referências aos objetos após carregar
     */
    static fromJSON(json) {
        const point = new IntersectionPoint(null, null, json.intersectionIndex);
        point.id = json.id;
        point.selected = json.selected;
        point.hidden = json.hidden;
        point.color = json.color;
        point.isDependent = json.isDependent;
        point.obj1Id = json.obj1Id;
        point.obj2Id = json.obj2Id;
        return point;
    }

    /**
     * Reconstrói as referências aos objetos após carregar
     */
    rebuildReferences(construction) {
        if (this.obj1Id !== null) {
            this.obj1 = construction.objects.find(obj => obj.id === this.obj1Id);
        }
        if (this.obj2Id !== null) {
            this.obj2 = construction.objects.find(obj => obj.id === this.obj2Id);
        }
        
        // Reconfigurar dependências
        this.setupDependencies();
        
        // Atualizar posição
        this.updatePosition();
        
        // Limpar IDs temporários
        delete this.obj1Id;
        delete this.obj2Id;
    }
}