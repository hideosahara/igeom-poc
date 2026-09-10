# iGeom Web - Geometria Dinâmica

Versão moderna web do iGeom - Sistema de Geometria Dinâmica, migrado de Java Applet para JavaScript/HTML5 Canvas.

## 🚀 Funcionalidades Implementadas

### Ferramentas de Construção
- **Ponto**: Criar pontos livres ou sobre objetos
- **Reta**: Criar retas infinitas
- **Segmento**: Criar segmentos de reta
- **Semireta**: Criar semiretas
- **Circunferência**: Criar circunferências definidas por centro e ponto
- **Interseção**: Calcular interseções entre objetos

### Ferramentas de Manipulação
- **Selecionar**: Selecionar objetos para operações
- **Mover**: Arrastar pontos para mover objetos
- **Esconder**: Esconder objetos selecionados

### Funcionalidades Gerais
- **Salvar**: Exportar construção para JSON
- **Carregar**: Importar construção de JSON
- **Limpar**: Limpar toda a construção
- **Coordenadas**: Visualização de coordenadas cartesianas em tempo real

## 📁 Estrutura do Projeto

```
igeom-poc/
├── index.html                 # Página principal
├── styles.css                 # Estilos CSS
├── app.js                     # Aplicação principal
├── geometry/                  # Classes geométricas
│   ├── Point.js              # Ponto
│   ├── Line.js               # Reta
│   ├── Segment.js            # Segmento
│   ├── Ray.js                # Semireta
│   ├── Circle.js             # Circunferência
│   └── Intersection.js       # Cálculo de interseções
├── utils/                     # Utilitários
│   ├── CoordinateSystem.js   # Sistema de coordenadas
│   ├── Renderer.js           # Renderização no canvas
│   └── Collision.js          # Detecção de colisão
└── state/                     # Gerenciamento de estado
    ├── Construction.js       # Estado da construção
    └── ToolManager.js        # Gerenciador de ferramentas
```

## 🎯 Como Usar

### Executar a Aplicação

1. Navegue até a pasta `igeom-poc`
2. Inicie um servidor web local:
   ```bash
   python3 -m http.server 8080
   ```
3. Abra o navegador em `http://localhost:8080`

### Criar Objetos

1. **Ponto**: Clique na ferramenta Ponto e clique no canvas
2. **Reta/Segmento/Semireta**: 
   - Selecione a ferramenta
   - Clique no primeiro ponto
   - Clique no segundo ponto
3. **Circunferência**:
   - Selecione a ferramenta Circunferência
   - Clique no centro
   - Clique em um ponto na circunferência
4. **Interseção**:
   - Selecione a ferramenta Interseção
   - Clique no primeiro objeto
   - Clique no segundo objeto

### Manipular Objetos

1. **Selecionar**: Clique na ferramenta Selecionar e clique nos objetos
2. **Mover**: Clique na ferramenta Mover, arraste pontos
3. **Esconder**: Selecione objetos e use a ferramenta Esconder

### Salvar/Carregar

1. **Salvar**: Clique em "Salvar" para baixar um arquivo JSON
2. **Carregar**: Clique em "Carregar" e selecione um arquivo JSON

## 🔧 Diferenças em Relação ao Original

### Tecnologias
- **Original**: Java Applet + AWT
- **Novo**: JavaScript + HTML5 Canvas

### Arquitetura
- **Original**: Classes Java com estado mutável
- **Novo**: Classes JavaScript com gestão de estado moderna

### Sistema de Coordenadas
- Mantido o sistema cartesiano com Y invertido (compatível com o original)

### Persistência
- **Original**: Formato proprietário `.geo`
- **Novo**: JSON (mais interoperável)

## 🚧 Próximos Passos (Funcionalidades a Implementar)

1. **Script System**: Reimplementar o sistema de scripts do original
2. **Undo/Redo**: Histórico de ações
3. **Zoom/Pan**: Controle de zoom e pan do canvas
4. **Grid**: Grade de referência
5. **Snap**: Ajuste automático a pontos e objetos
6. **Medições**: Exibir distâncias, ângulos, etc.
7. **Exportar Imagem**: Salvar construção como imagem
8. **Compatibilidade**: Ler arquivos do formato original `.geo`
9. **Touch Events**: Suporte para dispositivos móveis
10. **Acessibilidade**: Melhorar acessibilidade

## 📝 Notas Técnicas

### Sistema de Coordenadas
- Origem no centro do canvas
- Eixo Y invertido (positivo para cima)
- Escala configurável (zoom)

### Renderização
- Canvas HTML5 com aceleração de hardware
- Double buffering automático
- Renderização de preview durante construção

### Detecção de Colisão
- Tolerância de 5 pixels para seleção
- Prioridade para pontos sobre outros objetos
- Distância euclidiana para cálculos

## 🎨 Cores

- **Pontos**: Verde (#2ecc71)
- **Linhas/Segmentos/Semiretas**: Azul (#3498db)
- **Circunferências**: Azul (#3498db)
- **Seleção**: Amarelo (#f1c40f)
- **Interseções**: Vermelho (#e74c3c)

## 📄 Licença

Este projeto é uma migração do iGeom original. Mantenha a licença original se aplicável.

## 👥 Autores

- **Original**: Ricardo Hideo Sahara
- **Migração Web**: Versão moderna implementada em 2026