import React from 'react';
import SideNavCard from './SideNavCard';


class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.state = {
            draw: false,
            ctx: null,
            currentStroke: [],
            historyStrokes: [

            ],
            lineWidth: 5,
            lineColor: '#000000',
            historyPosition: -1,
            sideNav: null,
            colorSamples: [
                '#ffffff', '#e0e0e0', '#9e9e9e', '#000000',
                '#8B0000', '#FF0000', '#FFA500', '#FFD700',
                '#FFFFE0', '#FFFF00', '#00FF00', '#008000',
                '#00FFFF', '#40E0D0', '#4B0082', '#FFC0CB',
                '#FF007F', '#A52A2A'
            ]
        }
    }
    componentDidMount() {
        const canvas = this.canvas.current;
        const ctx = canvas.getContext("2d");
        this.setState({ ctx: ctx })
    }
    drawStart = e => {
        if (this.state.draw) {
            if (e.touches && e.touches[0]) {
                this.stroke(this.state.ctx, e.touches[0].clientX - 65, e.touches[0].clientY - 60);
            } else {
                this.stroke(this.state.ctx, e.clientX - 65, e.clientY - 60)
            }
        }
    }
    stroke = (ctx, x, y) => {
        if (x && y) {
            ctx.strokeStyle = "black";

            const { currentStroke } = this.state;
            currentStroke.push([x, y, this.state.lineWidth, this.state.lineColor])
            this.setState({ currentStroke: currentStroke, historyPosition: this.state.historyPosition++ });
            ctx.lineTo(x, y);
            ctx.strokeStyle = this.state.lineColor;
            ctx.stroke();
        }
    }
    mouseDown = e => {
        const currentStroke = this.state.currentStroke;
        this.state.ctx.beginPath();
        this.state.ctx.lineWidth = this.state.lineWidth;
        this.state.ctx.strokeStyle = this.state.lineColor;
        this.state.ctx.beginPath();
        if (e.touches && e.touches[0]) {
            this.state.ctx.moveTo(e.touches[0].clientX - 65, e.touches[0].clientY - 60);
            this.state.ctx.lineTo(e.touches[0].clientX - 65, e.touches[0].clientY - 60)
            currentStroke.push([e.touches[0].clientX - 65, e.touches[0].clientY - 60, this.state.lineWidth, this.state.lineColor]);
        } else {
            this.state.ctx.moveTo(e.clientX - 65, e.clientY - 60);
            this.state.ctx.lineTo(e.clientX - 65, e.clientY - 60)
            currentStroke.push([e.clientX - 65, e.clientY - 60, this.state.lineWidth, this.state.lineColor]);
        }
        this.setState({ draw: true, currentStroke: currentStroke, historyPosition: this.state.historyPosition + 1 });
    }
    dropEnd = (e) => {
        let { historyStrokes, historyPosition } = this.state;
        historyStrokes = historyStrokes.slice(0, historyPosition);
        historyStrokes.push(this.state.currentStroke);
        this.setState({ draw: false, historyStrokes, currentStroke: [] })

        let ctx = this.state.ctx;
        var imgData = ctx.getImageData(0, 0, this.canvas.current.width, this.canvas.current.height);
        var data = imgData.data;
        for (var i = 0; i < data.length; i += 4) {
            if (data[i + 3] < 255) {
                data[i] = 255;
                data[i + 1] = 255;
                data[i + 2] = 255;
                data[i + 3] = 255;
            }
        }
        ctx.putImageData(imgData, 0, 0);
        this.setState({ ctx })
    }
    componentDidUpdate(prevProps, prevState) {
    }
    undoCanvas = () => {
        let { historyStrokes, ctx, historyPosition } = this.state;
        if (historyPosition > -1) {
            const canvas = this.canvas.current;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < historyPosition; i++) {
                ctx.beginPath();
                ctx.moveTo(historyStrokes[i][0], historyStrokes[i][1]);
                for (let j = 1; j < historyStrokes[i].length; j++) {
                    ctx.lineWidth = historyStrokes[i][j][2];
                    ctx.lineTo(historyStrokes[i][j][0], historyStrokes[i][j][1]);
                }
                ctx.strokeStyle = historyStrokes[i][0][3];
                ctx.stroke();
            }
            this.setState({ historyPosition: this.state.historyPosition - 1 })
        }
    }
    redoCanvas = () => {
        let { historyStrokes, historyPosition, ctx } = this.state;
        ctx.beginPath();
        if (historyStrokes[historyPosition + 1]) {
            ctx.moveTo(historyStrokes[historyPosition + 1][0], historyStrokes[historyPosition + 1][1])
            ctx.lineWidth = historyStrokes[historyPosition + 1][2];
            for (let j = 1; j < historyStrokes[historyPosition + 1].length; j++) {
                ctx.lineWidth = historyStrokes[historyPosition + 1][j][2];
                ctx.strokeStyle = historyStrokes[historyPosition + 1][j][3];
                ctx.lineTo(historyStrokes[historyPosition + 1][j][0], historyStrokes[historyPosition + 1][j][1]);
            }
            ctx.stroke();
            this.setState({ historyPosition: this.state.historyPosition + 1 })
        }
    }
    toggleSideNav = val => {
        if (this.state.sideNav && (this.state.sideNav === val)) {
            this.setState({ sideNav: null })
            return
        }
        this.setState({ sideNav: val })
    }
    colorCard = () => (
        <SideNavCard>
            <p>Change Brush Color</p>
            <hr />
            <p>{this.state.lineColor}</p>
            <p>Select Color</p>
            <input className="ColorSelector" type="color" onChange={e => this.setState({ lineColor: e.target.value })}
                value={this.state.lineColor}></input>
            <hr />
            <p>Hex Code Input</p>
            <input className="HexInput" type="text" value={this.state.lineColor}
                pattern="^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$"
                onChange={e => this.setState({ lineColor: e.target.value })} />
            <hr />
            <p>Pick Color</p>
            <div className="ColorBoxes">
                {this.state.colorSamples.map((color, i) => {
                    return <div onClick={() => this.setState({ lineColor: color })}
                        style={{ background: color }} key={i} ></div>
                })}
            </div>
        </SideNavCard>
    )
    brushCard = () => (
        <SideNavCard>
            <p>Brush Size</p>
            <p>{this.state.lineWidth}</p>
            <div className="BrushSizes">
                <div onClick={() => this.setState({ lineWidth: 5 })} className="BrushSize">
                    <p>5px</p>
                    <div style={{ width: 5, height: 5, background: '#000000', borderRadius: '50%' }}
                    ></div>
                </div>
                <div onClick={() => this.setState({ lineWidth: 10 })} className="BrushSize">
                    <p>10px</p>
                    <div style={{ width: 10, height: 10, background: '#000000', borderRadius: '50%' }}
                    ></div>
                </div>
                <div onClick={() => this.setState({ lineWidth: 20 })} className="BrushSize">
                    <p>20px</p>
                    <div style={{ width: 20, height: 20, background: '#000000', borderRadius: '50%' }}
                    ></div>
                </div>
                <div onClick={() => this.setState({ lineWidth: 30 })} className="BrushSize">
                    <p>30px</p>
                    <div style={{ width: 30, height: 30, background: '#000000', borderRadius: '50%' }}
                    ></div>
                </div>
                <div onClick={() => this.setState({ lineWidth: 40 })} className="BrushSize">
                    <p>40px</p>
                    <div style={{ width: 40, height: 40, background: '#000000', borderRadius: '50%' }}
                    ></div>
                </div>
                <div onClick={() => this.setState({ lineWidth: 50 })} className="BrushSize">
                    <p>50px</p>
                    <div style={{ width: 50, height: 50, background: '#000000', borderRadius: '50%' }}
                    ></div>
                </div>
            </div>
            <p>brush size: 1 - 50</p>
            <input type="range" min="1" max="50"
                value={this.state.lineWidth} onChange={e => this.setState({ lineWidth: e.target.value })}
                class="slider" id="myRange"></input>
        </SideNavCard>
    )
    eraserCard = () => (
        <SideNavCard>
            <p>Eraser Size</p>
            <p>{this.state.lineWidth}</p>
            <div className="EraserSizes">
                <div onClick={() => this.setState({ lineWidth: 5, lineColor: '#ffffff' })} className="EraserSize">
                    <p>5px</p>
                    <div style={{ width: 5, height: 5, border: '1px solid black' }}
                    ></div>
                </div>
                <div onClick={() => this.setState({ lineWidth: 10, lineColor: '#ffffff' })} className="EraserSize">
                    <p>10px</p>
                    <div style={{ width: 10, height: 10, border: '1px solid black' }}
                    ></div>
                </div>
                <div onClick={() => this.setState({ lineWidth: 20, lineColor: '#ffffff' })} className="EraserSize">
                    <p>20px</p>
                    <div style={{ width: 20, height: 20, border: '1px solid black' }}
                    ></div>
                </div>
                <div onClick={() => this.setState({ lineWidth: 30, lineColor: '#ffffff' })} className="EraserSize">
                    <p>30px</p>
                    <div style={{ width: 30, height: 30, border: '1px solid black' }}
                    ></div>
                </div>
                <div onClick={() => this.setState({ lineWidth: 40, lineColor: '#ffffff' })} className="EraserSize">
                    <p>40px</p>
                    <div style={{ width: 40, height: 40, border: '1px solid black' }}
                    ></div>
                </div>
                <div onClick={() => this.setState({ lineWidth: 50, lineColor: '#ffffff' })} className="EraserSize">
                    <p>50px</p>
                    <div style={{ width: 50, height: 50, border: '1px solid black' }}
                    ></div>
                </div>
            </div>
            <p>Eraser size: 1 - 50</p>
            <input type="range" min="1" max="50"
                value={this.state.lineWidth} onChange={e => this.setState({ lineWidth: e.target.value })}
                class="slider" id="myRange"></input>
        </SideNavCard>
    )
    render() {

        return (
            <div className="Canvas">
                <div className="Header">
                    <p>SketchPad by <a href="https://twitter.com/bello_musodiq">Mayowa Bello</a></p>
                </div>
                <div className="SketchPad">
                    <div className="ToolBar">
                        <i className="fas fa-undo" onClick={this.undoCanvas}></i>
                        <i className="fas fa-redo" onClick={this.redoCanvas} ></i>
                        <i className="fas fa-palette"
                            style={this.state.sideNav === 'color' ? {
                                background: '#212121',
                                color: '#fff'
                            } : null}
                            onClick={() => this.toggleSideNav('color')} ></i>
                        {this.state.sideNav === 'color' && this.colorCard()}
                        <i className="fas fa-pencil-alt"
                            style={this.state.sideNav === 'size' ? {
                                background: '#212121',
                                color: '#fff'
                            } : null}
                            onClick={() => this.toggleSideNav('size')} ></i>
                        {this.state.sideNav === 'size' && this.brushCard()}
                        <i className="fas fa-eraser"
                            style={this.state.sideNav === 'eraser' ? {
                                background: '#212121',
                                color: '#fff'
                            } : null}
                            onClick={() => this.toggleSideNav('eraser')} ></i>
                        {this.state.sideNav === 'eraser' && this.eraserCard()}
                        {this.state.ctx ?
                            <a href={this.state.ctx.canvas.toDataURL('image/jpeg', 1.0)}
                                style={{ fontSize: '2em', color: '#000' }}
                                download="bello-sketch.jpg" ><i className="fas fa-save"></i></a>
                            : null}
                    </div>
                    <canvas
                        onMouseMove={this.drawStart}
                        onMouseDown={this.mouseDown}
                        onMouseUp={this.dropEnd}
                        onTouchMove={this.drawStart}
                        onTouchStart={this.mouseDown}
                        onTouchEnd={this.dropEnd}
                        ref={this.canvas} style={{ display: 'flex' }} width={window.innerWidth - 65} height={window.innerHeight - 60} />
                    <div>
                        {/* <input type="number" value={this.state.lineWidth} onChange={e => this.setState({ lineWidth: e.target.value })} /> */}
                    </div>
                </div>
            </div>
        )
    }
}
export default Canvas;