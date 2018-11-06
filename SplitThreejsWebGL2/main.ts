import Three from "three";

class ThreeWebGL2 {
    private canvas: HTMLCanvasElement;
    private gl: WebGLRenderingContext;
    private scene: Three.Scene;
    private renderer: Three.WebGLRenderer;
    private camera : Three.PerspectiveCamera;
    constructor(canvasId: string){
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        this.gl = this.canvas.getContext("webgl2") as WebGLRenderingContext;
        this.camera = new Three.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
        this.camera.position.z = 70;
        this.scene = new Three.Scene();

        this.renderer = new Three.WebGLRenderer({canvas: this.canvas, context: this.gl});
        this.config();
        var material = new THREE.ShaderMaterial( {
            vertexShader: document.getElementById( 'vs' ).textContent.trim(),
            fragmentShader: document.getElementById( 'fs' ).textContent.trim()
        } );
    }

    private config(){
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

new ThreeWebGL2("canvas");
