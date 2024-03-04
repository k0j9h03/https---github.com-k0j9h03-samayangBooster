
// 기본 전역변수 설정 
const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000); // 투시카메라


// 직교카메라 해제시 width, height 변수도 주석처리해줄것
const width = window.innerWidth;
const height = window.innerHeight;
const camera = new THREE.OrthographicCamera( width / -200, width / 200, height / 200, height / -200, 100, 1000 );


const renderer = new THREE.WebGLRenderer({ antialias: true }); // 안티알리어스 추가 
const container = document.getElementById('three-container'); 
const hdriPath = 'bush_restaurant_4k.exr'; // hdr이미지 업로드
const texturePath1 = 'package_UV_guide.jpg'; // 첫 번째 텍스처 경로
const texturePath2 = 'dawn.jpg'; // 두 번째 텍스처 경로


// 렌더러 설정
renderer.setSize(container.offsetWidth, container.offsetHeight); 
renderer.setClearColor(0x000000); // 배경색을 흰색으로 설정
document.body.appendChild(renderer.domElement); 
container.appendChild(renderer.domElement); 

const loader = new THREE.OBJLoader();
const textureLoader = new THREE.TextureLoader();
const exrLoader = new THREE.EXRLoader();


/** 해상도 조정함수 입니다 */
function adjustResolution() {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    // 뷰포트 크기 변경
    renderer.setSize(newWidth, newHeight);

    // 카메라 비율 조정
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
}

/** 조명 추가 : EXR텍스처 주석처리 */
function setupLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

        // // HDRI(EXR) 텍스처 로드
        // exrLoader.load(hdriPath, function (texture) {
        //     // HDRI(EXR) 텍스처를 사용하여 환경 조명 생성
        //     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        //     scene.add(ambientLight);
    
        //     // HemisphereLight는 하늘과 지표면의 색상을 자동으로 조정
        //     const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.1);
        //     scene.add(hemisphereLight);
    
        //     // HDRI 빛의 강도 조절
        //     const hdriIntensity = 0.1; // 원하는 HDRI 빛의 강도를 조절 (0에서 1 사이의 값)
        //     ambientLight.intensity = hdriIntensity;
        //     hemisphereLight.intensity = hdriIntensity;
        // });

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
    scene.add(directionalLight);
}


/** 카메라 및 올빗컨트롤 관련 함수 + 윈도우 리사이즈
 *  리사이즈 이벤트 감지되면 실행
 */
function setupCameraAndControls() {
    // camera.position.set(0, 3, 8); 
    camera.position.set(0, 3, 400); //직교카메라 전용 세팅값

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.style.height = '800px'; // 원하는 높이로 조절 
    }

    onWindowResize();
    window.addEventListener('resize', onWindowResize);

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.update();
}

/** 씬과 카메라 작동 :)  */
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

/** loadFirstObj()는 첫번째 파일을 로드하며 나머지 함수 실행  
*/
function loadFirstObj() {
    const material = new THREE.MeshStandardMaterial({ metalness: 1, roughness: 0 });

    // 텍스처 로드
    textureLoader.load(texturePath1, function (texture) {
        material.map = texture;
        material.needsUpdate = true;
        material.roughness = 0.1;
        material.metalness = 0.3;
        // material.color.set(0xff0000);

        // 첫 번째 OBJ 파일 로드
        loader.load('병.obj', function (object) {
            scene.add(object);

            // 로드된 첫 번째 OBJ 모델의 모든 메쉬에 기존의 재질을 적용
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material = material;
                }
            });

            // 첫 번째 모델의 위치 설정 (x, y, z)
            object.position.set(0, -1.5, 0);

            // 배경 이미지 경로 (배경 그냥 단색으로 설정 시 주석처리)
            const backgroundImagePath = '바보.jpg';

            // 배경 이미지 로드 (배경 그냥 단색으로 설정 시 주석처리)
            const backgroundTexture = textureLoader.load(backgroundImagePath);

            // 배경 이미지를 scene의 background로 설정 (배경 그냥 단색으로 설정 시 주석처리 )
            scene.background = backgroundTexture;

            // 관련 함수 모두 실행 (두번째 모델 로드 포함)
            adjustResolution();
            loadSecondObj(); 
            setupLights();
            setupCameraAndControls();
            animate();
        });
    });
}

/** 두 번째 obj 파일 업로드 함수입니다 */
function loadSecondObj() {
    // 두 번째 텍스처 로드
    textureLoader.load(texturePath2, function (texture) {
        const secondMaterial = new THREE.MeshStandardMaterial({ map: texture, metalness: 0.5, roughness: 0.5 });
            

        // 두 번째 OBJ 파일 로드
        loader.load('뚜껑.obj', function (object) {
            scene.add(object);

            // 로드된 두 번째 OBJ 모델의 모든 메쉬에 새로운 재질을 적용
            object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                    child.material = secondMaterial;

                    child.material.roughness = 0.2;
                    child.material.metalness = 0.1;
                    // child.material.color.set(0x00ff00);
                }
            });

            // 두 번째 모델의 위치 설정 ( x, y, z )
            object.position.set(0, -1.5, 0);
        });
    });
}

// 종합 함수 실행
loadFirstObj();
