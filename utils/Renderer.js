/**
 * Sistema de renderização para desenhar objetos geométricos no canvas
 */
class Renderer {
    constructor(canvas, coordinateSystem) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.coordinateSystem = coordinateSystem;
        this.pointRadius = 5;
        this.selectionColor = '#f1c40f'; // yellow
        this.pointColor = '#2ecc71'; // green
        this.lineColor = '#3498db'; // blue
        this.intersectionColor = '#e74c3c'; // red
    }

    /**
     * Limpa o canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Desenha um ponto
     */
    drawPoint(point) {
        if (point.hidden) return;
        
        const pixel = this.coordinateSystem.toPixel(point);
        const radius = this.pointRadius;
        
        this.ctx.beginPath();
        this.ctx.arc(pixel.x, pixel.y, radius, 0, 2 * Math.PI);
        
        if (point.selected) {
            this.ctx.fillStyle = this.selectionColor;
        } else if (point instanceof IntersectionPoint) {
            this.ctx.fillStyle = this.intersectionColor; // Vermelho para pontos de interseção
        } else {
            this.ctx.fillStyle = point.color;
        }
        
        this.ctx.fill();
        
        // Borda preta
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
    }

    /**
     * Desenha uma reta
     */
    drawLine(line) {
        if (line.hidden) return;
        
        const A = line.pointA;
        const B = line.pointB;
        
        // Calcular pontos extremos da reta no canvas
        const pixelA = this.coordinateSystem.toPixel(A);
        const pixelB = this.coordinateSystem.toPixel(B);
        
        // Calcular a equação da reta e encontrar interseção com as bordas
        const points = this.getLineBorderIntersections(pixelA, pixelB);
        
        if (points.length >= 2) {
            this.ctx.beginPath();
            this.ctx.moveTo(points[0].x, points[0].y);
            this.ctx.lineTo(points[1].x, points[1].y);
            
            if (line.selected) {
                this.ctx.strokeStyle = this.selectionColor;
            } else {
                this.ctx.strokeStyle = line.color;
            }
            
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
    }

    /**
     * Desenha um segmento
     */
    drawSegment(segment) {
        if (segment.hidden) return;
        
        const pixelA = this.coordinateSystem.toPixel(segment.pointA);
        const pixelB = this.coordinateSystem.toPixel(segment.pointB);
        
        this.ctx.beginPath();
        this.ctx.moveTo(pixelA.x, pixelA.y);
        this.ctx.lineTo(pixelB.x, pixelB.y);
        
        if (segment.selected) {
            this.ctx.strokeStyle = this.selectionColor;
        } else {
            this.ctx.strokeStyle = segment.color;
        }
        
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    /**
     * Desenha uma semireta
     */
    drawRay(ray) {
        if (ray.hidden) return;
        
        const origin = this.coordinateSystem.toPixel(ray.origin);
        const direction = this.coordinateSystem.toPixel(ray.directionPoint);
        
        // Calcular ponto extremo da semireta
        const endPoint = this.getRayBorderIntersection(origin, direction);
        
        if (endPoint) {
            this.ctx.beginPath();
            this.ctx.moveTo(origin.x, origin.y);
            this.ctx.lineTo(endPoint.x, endPoint.y);
            
            if (ray.selected) {
                this.ctx.strokeStyle = this.selectionColor;
            } else {
                this.ctx.strokeStyle = ray.color;
            }
            
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
    }

    /**
     * Desenha uma circunferência
     */
    drawCircle(circle) {
        if (circle.hidden) return;
        
        const center = this.coordinateSystem.toPixel(circle.center);
        const pointOnCircumference = this.coordinateSystem.toPixel(circle.pointOnCircumference);
        
        const radius = Math.sqrt(
            Math.pow(pointOnCircumference.x - center.x, 2) +
            Math.pow(pointOnCircumference.y - center.y, 2)
        );
        
        this.ctx.beginPath();
        this.ctx.arc(center.x, center.y, radius, 0, 2 * Math.PI);
        
        if (circle.selected) {
            this.ctx.strokeStyle = this.selectionColor;
        } else {
            this.ctx.strokeStyle = circle.color;
        }
        
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }

    /**
     * Desenha todos os objetos de uma construção
     */
    drawConstruction(construction) {
        this.clear();
        
        console.log('Renderizando construção com', construction.objects.length, 'objetos');
        
        // Desenhar linhas, segmentos, semiretas e circunferências primeiro
        construction.objects.forEach(obj => {
            if (obj instanceof Line) this.drawLine(obj);
            else if (obj instanceof Segment) this.drawSegment(obj);
            else if (obj instanceof Ray) this.drawRay(obj);
            else if (obj instanceof Circle) this.drawCircle(obj);
        });
        
        // Desenhar pontos por último (para ficarem por cima)
        construction.objects.forEach(obj => {
            if (obj instanceof Point) {
                console.log('Desenhando ponto:', obj, 'é IntersectionPoint?', obj instanceof IntersectionPoint);
                this.drawPoint(obj);
            }
        });
    }

    /**
     * Calcula as interseções de uma reta com as bordas do canvas
     */
    getLineBorderIntersections(pixelA, pixelB) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        const intersections = [];
        
        // Equação da reta: y - y1 = m(x - x1)
        const dx = pixelB.x - pixelA.x;
        const dy = pixelB.y - pixelA.y;
        
        if (Math.abs(dx) < 0.0001) {
            // Reta vertical
            intersections.push({ x: pixelA.x, y: 0 });
            intersections.push({ x: pixelA.x, y: height });
        } else if (Math.abs(dy) < 0.0001) {
            // Reta horizontal
            intersections.push({ x: 0, y: pixelA.y });
            intersections.push({ x: width, y: pixelA.y });
        } else {
            const m = dy / dx;
            const b = pixelA.y - m * pixelA.x;
            
            // Interseção com x = 0
            intersections.push({ x: 0, y: b });
            // Interseção com x = width
            intersections.push({ x: width, y: m * width + b });
            // Interseção com y = 0
            intersections.push({ x: -b / m, y: 0 });
            // Interseção com y = height
            intersections.push({ x: (height - b) / m, y: height });
        }
        
        // Filtrar pontos dentro do canvas
        return intersections.filter(p => 
            p.x >= 0 && p.x <= width && p.y >= 0 && p.y <= height
        );
    }

    /**
     * Calcula a interseção de uma semireta com as bordas do canvas
     */
    getRayBorderIntersection(origin, direction) {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        const dx = direction.x - origin.x;
        const dy = direction.y - origin.y;
        
        if (Math.abs(dx) < 0.0001 && Math.abs(dy) < 0.0001) {
            return null;
        }
        
        const intersections = [];
        
        // Verificar interseção com cada borda
        const borders = [
            { x: 0, y: null },
            { x: width, y: null },
            { x: null, y: 0 },
            { x: null, y: height }
        ];
        
        for (const border of borders) {
            let t;
            if (border.x !== null) {
                if (Math.abs(dx) > 0.0001) {
                    t = (border.x - origin.x) / dx;
                } else {
                    continue;
                }
            } else {
                if (Math.abs(dy) > 0.0001) {
                    t = (border.y - origin.y) / dy;
                } else {
                    continue;
                }
            }
            
            if (t > 0) {
                const x = origin.x + t * dx;
                const y = origin.y + t * dy;
                
                if (x >= 0 && x <= width && y >= 0 && y <= height) {
                    intersections.push({ x, y, t });
                }
            }
        }
        
        if (intersections.length === 0) return null;
        
        // Retornar o ponto mais próximo da origem
        intersections.sort((a, b) => a.t - b.t);
        return intersections[0];
    }
}