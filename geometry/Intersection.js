/**
 * Classe para calcular interseções entre objetos geométricos
 */
class Intersection {
    /**
     * Calcula a interseção entre duas retas
     */
    static lineLine(line1, line2) {
        const A1 = line1.pointA;
        const A2 = line1.pointB;
        const B1 = line2.pointA;
        const B2 = line2.pointB;
        
        const denom = (A1.x - A2.x) * (B1.y - B2.y) - (A1.y - A2.y) * (B1.x - B2.x);
        
        if (Math.abs(denom) < 0.0001) {
            return null; // Retas paralelas ou coincidentes
        }
        
        const x = ((A1.x * A2.y - A1.y * A2.x) * (B1.x - B2.x) - (A1.x - A2.x) * (B1.x * B2.y - B1.y * B2.x)) / denom;
        const y = ((A1.x * A2.y - A1.y * A2.x) * (B1.y - B2.y) - (A1.y - A2.y) * (B1.x * B2.y - B1.y * B2.x)) / denom;
        
        return new Point(x, y);
    }

    /**
     * Calcula a interseção entre uma reta e uma circunferência
     * Retorna array com 0, 1 ou 2 pontos
     */
    static lineCircle(line, circle) {
        const A = line.pointA;
        const B = line.pointB;
        const C = circle.center;
        const r = circle.radius;
        
        // Vetor direção da reta
        const dirX = B.x - A.x;
        const dirY = B.y - A.y;
        
        // Vetor do ponto A ao centro
        const toCenterX = C.x - A.x;
        const toCenterY = C.y - A.y;
        
        const a = dirX * dirX + dirY * dirY;
        const b = 2 * (dirX * toCenterX + dirY * toCenterY);
        const c = toCenterX * toCenterX + toCenterY * toCenterY - r * r;
        
        const discriminant = b * b - 4 * a * c;
        
        if (discriminant < 0) {
            return []; // Sem interseção
        }
        
        const sqrtDiscriminant = Math.sqrt(discriminant);
        const t1 = (-b - sqrtDiscriminant) / (2 * a);
        const t2 = (-b + sqrtDiscriminant) / (2 * a);
        
        const points = [];
        
        if (t1 >= 0 && t1 <= 1) {
            points.push(new Point(A.x + t1 * dirX, A.y + t1 * dirY));
        }
        
        if (t2 >= 0 && t2 <= 1 && Math.abs(t1 - t2) > 0.0001) {
            points.push(new Point(A.x + t2 * dirX, A.y + t2 * dirY));
        }
        
        return points;
    }

    /**
     * Calcula a interseção entre duas circunferências
     * Retorna array com 0, 1 ou 2 pontos
     */
    static circleCircle(circle1, circle2) {
        const C1 = circle1.center;
        const C2 = circle2.center;
        const r1 = circle1.radius;
        const r2 = circle2.radius;
        
        const d = C1.distance(C2);
        
        // Circunferências não se intersectam
        if (d > r1 + r2 || d < Math.abs(r1 - r2) || d === 0) {
            return [];
        }
        
        const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
        const h = Math.sqrt(r1 * r1 - a * a);
        
        const x2 = C1.x + a * (C2.x - C1.x) / d;
        const y2 = C1.y + a * (C2.y - C1.y) / d;
        
        const points = [];
        
        // Dois pontos de interseção
        if (h > 0.0001) {
            points.push(new Point(
                x2 + h * (C2.y - C1.y) / d,
                y2 - h * (C2.x - C1.x) / d
            ));
            points.push(new Point(
                x2 - h * (C2.y - C1.y) / d,
                y2 + h * (C2.x - C1.x) / d
            ));
        } else {
            // Um ponto de interseção (tangentes)
            points.push(new Point(x2, y2));
        }
        
        return points;
    }

    /**
     * Calcula interseção entre dois objetos genéricos
     */
    static intersect(obj1, obj2) {
        // Interseção reta-reta
        if (obj1 instanceof Line && obj2 instanceof Line) {
            const point = this.lineLine(obj1, obj2);
            return point ? [point] : [];
        }
        
        // Interseção reta-circunferência
        if (obj1 instanceof Line && obj2 instanceof Circle) {
            return this.lineCircle(obj1, obj2);
        }
        if (obj1 instanceof Circle && obj2 instanceof Line) {
            return this.lineCircle(obj2, obj1);
        }
        
        // Interseção circunferência-circunferência
        if (obj1 instanceof Circle && obj2 instanceof Circle) {
            return this.circleCircle(obj1, obj2);
        }
        
        // Para segmentos e semiretas, tratamos como retas para simplificar
        // Mas precisamos considerar todos os casos
        const isLineLike1 = obj1 instanceof Line || obj1 instanceof Segment || obj1 instanceof Ray;
        const isLineLike2 = obj2 instanceof Line || obj2 instanceof Segment || obj2 instanceof Ray;
        
        if (isLineLike1 && isLineLike2) {
            // Criar retas temporárias para o cálculo
            const line1 = obj1 instanceof Line ? obj1 : new Line(obj1.pointA, obj1.pointB);
            const line2 = obj2 instanceof Line ? obj2 : new Line(obj2.pointA, obj2.pointB);
            
            // Se um for circunferência
            if (obj1 instanceof Circle || obj2 instanceof Circle) {
                const circle = obj1 instanceof Circle ? obj1 : obj2;
                const line = obj1 instanceof Circle ? line2 : line1;
                return this.lineCircle(line, circle);
            }
            
            // Se ambos forem line-like
            const point = this.lineLine(line1, line2);
            return point ? [point] : [];
        }
        
        // Caso um seja line-like e outro circunferência
        if (isLineLike1 && obj2 instanceof Circle) {
            const line = obj1 instanceof Line ? obj1 : new Line(obj1.pointA, obj1.pointB);
            return this.lineCircle(line, obj2);
        }
        if (isLineLike2 && obj1 instanceof Circle) {
            const line = obj2 instanceof Line ? obj2 : new Line(obj2.pointA, obj2.pointB);
            return this.lineCircle(line, obj1);
        }
        
        return [];
    }
}