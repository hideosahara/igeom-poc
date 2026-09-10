/**
 * Sistema de coordenadas para conversão entre pixels e coordenadas cartesianas
 * Baseado no sistema original do iGeom onde Y é invertido
 */
class CoordinateSystem {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.originX = canvasWidth / 2;
        this.originY = canvasHeight / 2;
        this.scale = 1; // pixels por unidade
    }

    /**
     * Converte coordenadas cartesianas para pixels
     */
    toPixel(point) {
        return {
            x: this.originX + point.x * this.scale,
            y: this.originY - point.y * this.scale // Y invertido
        };
    }

    /**
     * Converte pixels para coordenadas cartesianas
     */
    toCartesian(pixelX, pixelY) {
        return {
            x: (pixelX - this.originX) / this.scale,
            y: -(pixelY - this.originY) / this.scale // Y invertido
        };
    }

    /**
     * Atualiza o tamanho do canvas
     */
    resize(width, height) {
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.originX = width / 2;
        this.originY = height / 2;
    }

    /**
     * Define a escala (zoom)
     */
    setScale(scale) {
        this.scale = scale;
    }

    /**
     * Define a origem do sistema de coordenadas
     */
    setOrigin(x, y) {
        this.originX = x;
        this.originY = y;
    }
}