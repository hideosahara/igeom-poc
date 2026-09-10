/**
 * Sistema de detecção de colisão para encontrar objetos sob o cursor
 */
class Collision {
    constructor(coordinateSystem) {
        this.coordinateSystem = coordinateSystem;
        this.tolerance = 5; // pixels de tolerância
    }

    /**
     * Encontra o objeto mais próximo de uma posição no canvas
     */
    findObjectAt(pixelX, pixelY, construction) {
        const cartesian = this.coordinateSystem.toCartesian(pixelX, pixelY);
        const point = new Point(cartesian.x, cartesian.y);
        
        let closestObject = null;
        let minDistance = Infinity;
        
        // Verificar pontos primeiro
        for (const obj of construction.objects) {
            if (obj instanceof Point && !obj.hidden) {
                const pixel = this.coordinateSystem.toPixel(obj);
                const distance = Math.sqrt(
                    Math.pow(pixel.x - pixelX, 2) + 
                    Math.pow(pixel.y - pixelY, 2)
                );
                
                if (distance < this.tolerance && distance < minDistance) {
                    minDistance = distance;
                    closestObject = obj;
                }
            }
        }
        
        // Se não encontrou ponto, verificar outros objetos
        if (!closestObject) {
            for (const obj of construction.objects) {
                if (obj.hidden) continue;
                
                let distance;
                
                if (obj instanceof Line) {
                    distance = obj.distanceToPoint(point);
                    // Converter distância cartesiana para pixels
                    distance *= this.coordinateSystem.scale;
                } else if (obj instanceof Segment) {
                    distance = obj.distanceToPoint(point);
                    distance *= this.coordinateSystem.scale;
                } else if (obj instanceof Ray) {
                    distance = obj.distanceToPoint(point);
                    distance *= this.coordinateSystem.scale;
                } else if (obj instanceof Circle) {
                    distance = obj.distanceToPoint(point);
                    distance *= this.coordinateSystem.scale;
                } else {
                    continue;
                }
                
                if (distance < this.tolerance && distance < minDistance) {
                    minDistance = distance;
                    closestObject = obj;
                }
            }
        }
        
        return closestObject;
    }

    /**
     * Encontra todos os objetos em uma posição no canvas
     */
    findAllObjectsAt(pixelX, pixelY, construction) {
        const cartesian = this.coordinateSystem.toCartesian(pixelX, pixelY);
        const point = new Point(cartesian.x, cartesian.y);
        const objects = [];
        
        // Verificar pontos
        for (const obj of construction.objects) {
            if (obj instanceof Point && !obj.hidden) {
                const pixel = this.coordinateSystem.toPixel(obj);
                const distance = Math.sqrt(
                    Math.pow(pixel.x - pixelX, 2) + 
                    Math.pow(pixel.y - pixelY, 2)
                );
                
                if (distance < this.tolerance) {
                    objects.push(obj);
                }
            }
        }
        
        // Verificar outros objetos
        for (const obj of construction.objects) {
            if (obj.hidden || obj instanceof Point) continue;
            
            let distance;
            
            if (obj instanceof Line) {
                distance = obj.distanceToPoint(point);
                distance *= this.coordinateSystem.scale;
            } else if (obj instanceof Segment) {
                distance = obj.distanceToPoint(point);
                distance *= this.coordinateSystem.scale;
            } else if (obj instanceof Ray) {
                distance = obj.distanceToPoint(point);
                distance *= this.coordinateSystem.scale;
            } else if (obj instanceof Circle) {
                distance = obj.distanceToPoint(point);
                distance *= this.coordinateSystem.scale;
            } else {
                continue;
            }
            
            if (distance < this.tolerance) {
                objects.push(obj);
            }
        }
        
        return objects;
    }

    /**
     * Encontra o ponto mais próximo de uma posição no canvas
     */
    findPointAt(pixelX, pixelY, construction) {
        const cartesian = this.coordinateSystem.toCartesian(pixelX, pixelY);
        const point = new Point(cartesian.x, cartesian.y);
        
        let closestPoint = null;
        let minDistance = Infinity;
        
        for (const obj of construction.objects) {
            if (obj instanceof Point && !obj.hidden) {
                const pixel = this.coordinateSystem.toPixel(obj);
                const distance = Math.sqrt(
                    Math.pow(pixel.x - pixelX, 2) + 
                    Math.pow(pixel.y - pixelY, 2)
                );
                
                if (distance < this.tolerance && distance < minDistance) {
                    minDistance = distance;
                    closestPoint = obj;
                }
            }
        }
        
        return closestPoint;
    }
}