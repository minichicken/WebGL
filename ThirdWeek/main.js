"use strict";
let gl, program, buffer;

window.addEventListener("load", setupWebGL, false);

function setupWebGL(evt) {
    /**
     * 더 이상 Load 이벤트가 일어나지 않으므로 삭제 한다.
     * querySelector 를 이용하여 canvas 객체를 가져온다.
     * canvas 객체의 크기를 실제 브라우져에서 보이는 크기로 지정한다.
     */
    window.removeEventListener(evt.type, setupWebGL, false);
    let paragraph = document.querySelector("p");
    let canvas = document.querySelector("canvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    /**
     * canvas 에서 webgl 객체를 가져오거나 experimental-webgl 객체를 가져온다.
     * 실패시 P element 에 브라우져에서 webgl 이 지원되지 않는다고 표시 후 스크립트 종료.
     * @type {CanvasRenderingContext2D | WebGLRenderingContext}
     */
    gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
        paragraph.innerHTML = "WebGL를 로드하는데 실패하였습니다. 브라우져나 디바이스에서 지원하지 않습니다.";
        return;
    }
    /**
     * canvas 에 그릴 gl 뷰 크기를 지정한다.
     * canvas 배경 생상을 검정색으로 지정한다.
     * 지정한 생상으로 색을 초기화한다.
     */
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    /**
     * html 에서 nonjs 인 vertex shader 코드를 가져온다.
     * 로드하는 과정에서 shader 가 커지면 관리하기가 엄청 애매한데 ajax 같은걸로 불러오기만 하면 되긴 된다.
     * 개선 방안을 찾아봐야 할듯...
     * glsl 은 c 언어 기반의 superSet 언어이다. c를 확장하여 만든 언어로 따로 컴파일 과정이 필요하다.
     * vertex shader 를 생성한다.
     * 생성한 shader 에 소스 코드를 넣는다.
     * 그리고 컴파일 한다.
     * 같은 방법으로 fragment 소스코드를 불러오고 컴파일
     */
    let source = document.querySelector("#vertex-shader").innerHTML;
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, source);
    gl.compileShader(vertexShader);
    source = document.querySelector("#fragment-shader").innerHTML;
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, source);
    gl.compileShader(fragmentShader);
    /**
     * shader 를 사용하기 위한 프로그램을 생성한다.
     * 프로그램에 컴파일한 shader 를 붙인다.
     * gl 에 프로그램을 사용할 수 있도록 연결한다.
     * gl 에 연결 되었으므로 프로그램에서 shader 를 제거한다.
     */
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    /**
     * 프로그램이 정상적으로 연결 되었는지 확인한다.
     * 프로그램에 link 명령이 성공 했는지 반환한다.
     * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/getProgramParameter
     * 실패시 프로그램 로그를 가져온다.
     * gl 종료.
     * P element 에 Shader program 연결에 실패 하였다고 로그와 함께 표시한 후 종료.
     */
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        let linkErrLog = gl.getProgramInfoLog(program);
        cleanup();
        paragraph.innerHTML = "Shader program 연결에 실패 하였습니다. Error log: " + linkErrLog;
        return;
    }
    /**
     * initializeAttributes
     */
    gl.enableVertexAttribArray(0);
    buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 0, 0);
    /**
     * 프로그램을 사용한다.
     * 그리고 그린다.
     *
     */
    gl.useProgram(program);
    gl.drawArrays(gl.POINTS, 0, 1);

    // gl 종료
    cleanup();
}

/**
 * Shader 프로그램 연결을 실패 하거나 gl 이 종료되었을 때 정리하기 위한 함수
 * 프로그램을 gl 에서 null 로 초기화 한다.
 * program 객체가 남아 있으면 제거 한다.
 * buffer 객체가 남아 있으면 제거한다.
 */
function cleanup() {
    gl.useProgram(null);
    if (program) {
        gl.deleteProgram(program);
    }
    if (buffer) {
        gl.deleteBuffer(buffer);
    }
}
