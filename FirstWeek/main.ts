let gl: WebGLRenderingContext | null, timer, rainingRect: Rectangle, scoreDisplay: HTMLElement,
    missesDisplay: HTMLElement;

const canvas: HTMLCanvasElement = document.querySelector("canvas") as HTMLCanvasElement;
const paragraph: HTMLParagraphElement = document.querySelector("p") as HTMLParagraphElement;

window.addEventListener("load", setupAnimation, false);

function setupAnimation(evt: Event) {
    window.removeEventListener(evt.type, setupAnimation, false);
    /**
     * 실제로 브라우져 와면에서 보여지는 크기를 canvas 크기로 지정한다
     */
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    /**
     * canvas 에서 webgl context 를 가져온다.
     * 만약 가져오지 못한다면 experimental-webgl 을 가져온다.
     * 자바스크립트의 || 특성을 이용한 방식 ||문 앞이 undefined 아면 뒤 구문을 가져간다.
     *
     * webgl 미 지원시 p 태그를 가져와서 로두 살패를 알림.
     */
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
        paragraph.innerHTML = "브라우져에서 WebGL을 지원하지 않습니다.";
        return;
    }
    /**
     * gl.viewport gl의 해상도를 지정 그러나 랜더링 해상도가 올라가지 않는다.
     * 좌표 0, 0 부터 canvas 실제 랜더링 크기만금 지정한다.
     * gl.clearColor(red, green, blue, alpha); 색상을 초기화 한다.
     * gl.clear 버퍼를 초기화하여 사전 설정값으로 설정합니다.
     * gl.COLOR_BUFFER_BIT   gl.DEPTH_BUFFER_BIT   gl.STENCIL_BUFFER_BIT
     * clearColor() 나 clearDepth() 혹은 clearStencill()로 사전 설정 값을 지정할 수 있습니다.
     * gl.enable 기능 활성화 및 비활성화 https://www.khronos.org/opengl/wiki/GLAPI/glEnable
     */
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.SCISSOR_TEST);

    /**
     * 삼각형 객체 생성
     * 0.017초 마다 애니메이션을 갱신한다.
     */
    rainingRect = new Rectangle();
    timer = setTimeout(drawAnimation, 17);
    /**
     * 마우스 버튼이 내려갈때 처리와 터치 될때 처리 기존 클릭은 마우스버튼이 내려가고 올라와야 정상적으로 처리가 되어서 미스나는 경우가 많았다.
     * 점수를 넣을 HTML요소 지정
     */
    canvas.addEventListener("mousedown", playerClick, false);
    // canvas.addEventListener("touchstart", playerClick, false);
    const displays = document.querySelectorAll("strong");
    scoreDisplay = displays[0];
    missesDisplay = displays[1];
}

/**
 * 점수 및 놓친 개수
 */
let score = 0, misses = 0;

function drawAnimation() {
    /**
     * 내려가는 객체의 색상을 빠져나오지 않도록 자른다.
     * https://www.khronos.org/opengl/wiki/Scissor_Test
     */
    if (!gl) return;
    gl.scissor(rainingRect.position[0], rainingRect.position[1], rainingRect.size[0], rainingRect.size[1]);
    gl.clear(gl.COLOR_BUFFER_BIT);
    rainingRect.position[1] -= rainingRect.velocity;
    if (rainingRect.position[1] < 0) {
        misses += 1;
        missesDisplay.innerHTML = misses.toString();
        rainingRect = new Rectangle();
    }
    timer = setTimeout(drawAnimation, 17);
}

function playerClick(evt: MouseEvent) {
    if (!gl) return;
    const target = evt.target as HTMLElement;
    let position = [
        evt.pageX - target.offsetLeft,
        gl.drawingBufferHeight - (evt.pageY - target.offsetTop),
    ];
    let diffPos = [position[0] - rainingRect.position[0],
        position[1] - rainingRect.position[1]];
    if (diffPos[0] >= 0 && diffPos[0] < rainingRect.size[0] && diffPos[1] >= 0 && diffPos[1] < rainingRect.size[1]) {
        score += 1;
        scoreDisplay.innerHTML = score.toString();
        rainingRect = new Rectangle();
    }
}

class Rectangle {
    velocity!: number;
    size!: number[];
    position!: number[];
    color!: number[];

    constructor() {
        /**
         * react 가 Rectangle 을 가리키게 함
         * 램덤숫자 생성
         * 사각형 크기를 램덤값으로 지정
         * 위치를 지정한다
         * 램덤값 *(canvas 의 가로 - 사각형의 가로 값)
         * gl.drawingBufferHeight canvas 의 세로
         */
        if (!gl) return;
        let rect = this; // Rectangle
        let randNumbers = getRandomVector();
        rect.size = [
            5 + 120 * randNumbers[0],
            5 + 120 * randNumbers[1]
        ];
        rect.position = [
            randNumbers[2] * (gl.drawingBufferWidth - rect.size[0]),
            gl.drawingBufferHeight
        ];
        /**
         * 속도 지정
         * 색상 램덤값 지정
         * 객체에 색상 램덤값 지정
         */
        rect.velocity = 1.0 + 6.0 * Math.random();
        rect.color = getRandomVector();
        gl.clearColor(rect.color[0], rect.color[1], rect.color[2], 1.0);

        /**
         * 램덤 숫자 배열 생성
         */
        function getRandomVector() {
            return [Math.random(), Math.random(), Math.random()];
        }
    }
}
