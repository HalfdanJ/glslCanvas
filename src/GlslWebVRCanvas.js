import GlslCanvas from './GlslCanvas'

export default class GlslWebVRCanvas extends GlslCanvas {
    constructor(canvas, options){
        options = options || {};
        options.manualRenderLoop = true;

        /*options.vertexString = options.vertexString || `
        #ifdef GL_ES
        precision mediump float;
        #endif

        attribute vec2 a_position;
        attribute vec2 a_texcoord;

        varying vec2 v_texcoord;

        void main() {
            gl_Position = vec4(a_position, 0.0, 1.0) + vec4(0.5,0.,0,0);
            v_texcoord = a_texcoord + vec2(1000,0);
        }
        `;*/

        super(canvas, options)

        window.requestAnimationFrame(this.renderLoop.bind(this));
    }

    renderLoop(){
        window.requestAnimationFrame(this.renderLoop.bind(this));
        this.forceRender = this.resize();
        this.render('l');
        this.render('r');
    }

    render(eye){
        let date = new Date();
        let now = date.getTime();
        if (this.nDelta > 1) {
            this.uniform('1f', 'float', 'u_time', (now - this.timePrev) / 1000.0);
            this.timePrev = now;
        }

        if (this.nTime > 1 ) {
            // set the time uniform
            this.uniform('1f', 'float', 'u_time', (now - this.timeLoad) / 1000.0);
        }

        if (this.nDate) {
            // Set date uniform: year/month/day/time_in_sec
            this.uniform('4f', 'float', 'u_date', date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()*3600 + date.getMinutes()*60 + date.getSeconds() + date.getMilliseconds() * 0.001 );
        }


        this.texureIndex = 0;
        for (let tex in this.textures) {
            this.uniformTexture(tex);
        }

        if(!eye){
            // set the resolution uniform
            this.uniform('2f', 'vec2', 'u_resolution', this.canvas.width, this.canvas.height);

            // Viewport
            this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        } else {
            // set the resolution uniform
            this.uniform('2f', 'vec2', 'u_resolution', this.canvas.width/2, this.canvas.height);

            // Viewport
            if(eye == 'l'){
                this.gl.viewport(0, 0, this.canvas.width/2, this.canvas.height);
            } else {
                this.gl.viewport(this.canvas.width/2, 0, this.canvas.width/2, this.canvas.height);
            }
        }

        // Draw the rectangle.
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

        // Trigger event
        this.trigger('render', {});

        this.change = false;
    }
}

window.GlsGlslWebVRCanvaslCanvas = GlslWebVRCanvas;
