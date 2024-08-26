import { useState, useEffect } from 'react';
import styles from './App.module.css';

const API = "http://localhost:6974"

function Button({ text, handle, className, value, type, disabled }) {
  return (
    <button 
      type={type || "button"} 
      className={className} 
      onClick={() => handle && handle(value)}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

function FormInput({ maxlength, className, width, height, label, name, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div className={className}>
      <label htmlFor={name}>{label}</label>
      <input
        maxLength={maxlength}
        style={{ width, height }}  // 인라인 스타일로 width와 height 적용
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

function FormTextArea({ className, width, height, label, name, value, onChange, placeholder = "" }) {
  return (
    <div className={className}>
      <label htmlFor={name}>{label}</label>
      <textarea
        style={{ width, height, resize: "none" }}  // resize 속성으로 크기 조절 비활성화
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}


function ViewButton({ text, handle }) {
  return (
    <Button value={text} text={text} className={styles.ViewButton} handle={handle} />
  );
}

function User({ handle, loggedIn }) {
  return (
    <div className={styles.Account}>
      {loggedIn ? (
        <div className={styles.User}>
          <span>로그인 완료</span>
        </div>
      ) : (
        <div className={styles.Guest} onClick={() => handle("로그인")}>
          <img 
            className={styles.login} 
            src="login.png" 
            alt="로그인 아이콘" 
          />
          <Button text="로그인" className={styles.GuestButton} />
        </div>
      )}
    </div>
  );
}

function NavBar({ list, handle, loggedIn }) {
  return (
    <nav className={styles.NavBar}>
      <img className={styles.icon} src='nonglock.png' alt="농락 아이콘" />
      <h1 className={styles.title}>농락</h1>
      <div className={styles.buttonBar}>
        {Object.keys(list).map((key) => (
          <ViewButton key={key} text={key} handle={handle} />
        ))}
      </div>
      <User handle={handle} loggedIn={loggedIn} />
      <hr />
    </nav>
  );
}

function Main({ view }) {
  return (
    <main className={styles.Main}>
      {view}
    </main>
  );
}

function Catalog() {
  return (
    <section>
      <div className={styles.farmList}></div>
      <div className={styles.farmInfo}></div>
    </section>
  );
}

function Regist() {
  const [farmMoney, setFarmMoney] = useState(false);
  const [farmIntro, setFarmIntro] = useState('');
  const [farmInfo, setFarmInfo] = useState('');
  const [farmAddress, setFarmAddress] = useState('');
  const [farmCrop, setFarmCrop] = useState('');
  const [farmWork, setFarmWork] = useState(false);
  const [previewSrc, setPreviewSrc] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewSrc(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className={styles.Regist}>
      <div className={styles.formContainer}>
        <form className={styles.farmForm}>
          <div className={styles.formInfoLeft}>
            <FormInput placeholder="경상북도 의성군 의성읍" label="주소" name="farmAddress" value={farmAddress} onChange={(e) => setFarmAddress(e.target.value)} />
            <FormInput placeholder="마늘" label="작물" name="farmCrop" value={farmCrop} onChange={(e) => setFarmCrop(e.target.value)} />
            
            <FormInput 
              label="농업 유경험" 
              name="farmWork" 
              type="checkbox" 
              checked={farmWork} 
              onChange={(e) => setFarmWork(e.target.checked)} 
            />
            <FormInput 
              label="일당 유무" 
              name="farmMoney" 
              type="checkbox" 
              checked={farmMoney} 
              onChange={(e) => setFarmMoney(e.target.checked)} 
            />
            
            <label htmlFor="farmImage">밭 사진:</label>
            <input 
              type="file" 
              id="farmImage" 
              name="farmImage" 
              accept="image/*" 
              onChange={handleImageChange} 
            />
            <FormInput maxlength="20" placeholder="건강한 청년 구해요~" label="소개글" name="farmIntro" value={farmIntro} onChange={(e) => setFarmIntro(e.target.value)} />
          </div>
          <div className={styles.formInfoRight}>
            <FormTextArea 
              width="100%" 
              height="36vh" 
              placeholder="2000평에 일당없이 봉사할 사람 모집합니다. 새참은 챙겨드릴테니, 3일동안 해주셨으면 좋겠어요" 
              label="상세정보" 
              name="farmInfo" 
              value={farmInfo} 
              onChange={(e) => setFarmInfo(e.target.value)} 
            />
          </div>
        </form>

        <div className={styles.farmPreviewList}>
          <img 
            className={styles.image}
            src={previewSrc || 'placeholder_image.png'} 
            alt="사진 없음" 
            style={{ 
              width: '10vw', 
              height: '5vw', 
              objectFit: 'cover',
              overflow: 'hidden'
            }}
          />
          <div className={styles.PreviewList}>
            <div className={styles.br}>주소 : {farmAddress}</div>
            <div>작물 : {farmCrop} / </div>
            <div>조건 : {farmWork ? "농업 유경험자만" : "누구나"}</div>
            <div className={styles.br}>일당 유무 : {farmMoney ? "일당 O" : "자원봉사 희망"}</div>
          </div>
          <div className={styles.right}>소개글 : {farmIntro}</div>
        </div>
      </div>

      <div className={styles.farmPreviewInfo}>
        <div>상세정보 : {farmInfo}</div>
      </div>
    </section>
  );
}


function Community() {
  return (
    <section>
      2
    </section>
  );
}

function Login({ handle, setLoggedIn }) {
  const [login, setLogin] = useState(true);
  const [username, setUsername] = useState(''); // 'id'를 'username'으로 변경
  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const [work, setWork] = useState(false);
  const [name, setName] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState(true); // 'idAvailable'을 'usernameAvailable'로 변경

  const handleLoginSubmit = async (e) => {
    console.log(JSON.stringify({ username, password }));
    e.preventDefault();
    try {
      const response = await fetch(`${API}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // 응답이 JSON 형식인지 먼저 확인
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = await response.json(); // JSON 응답 처리
        console.log(data);

        if (data.success) {
          setLoggedIn(true);
          handle("둘러보기");
        } else {
          alert('로그인 실패: ' + data.message);
        }
      } else {
        const text = await response.text(); // JSON이 아닌 경우 텍스트로 응답 처리
        console.error('Unexpected response format:', text);
        alert('서버로부터 예상치 못한 응답을 받았습니다: ' + text);
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('로그인 처리 중 오류가 발생했습니다.');
    }
  };


  const handleRegisterSubmit = async (e) => {
    console.log(JSON.stringify({ username, password, work, name }))
    e.preventDefault();
    if (!usernameAvailable) {
      alert('사용할 수 없는 아이디입니다.');
      return;
    }
    if (password !== rePassword) {
      alert('비밀번호가 일치하지 않습니다.')
      return;
    }
    try {
      const response = await fetch(`${API}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, work, name }), // 'id' 대신 'username' 사용
      });
      const data = await response.json();
      if (data.success) {
        alert('회원가입 성공');
        setLogin(true); // 회원가입 후 로그인 페이지로 이동
      } else {
        alert('회원가입 실패');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('회원가입 처리 중 오류가 발생했습니다.');
    }
  };

  const checkUsernameAvailability = async (e) => {
    const enteredUsername = e.target.value;
    setUsername(enteredUsername);
    if (enteredUsername) {
      try {
        const response = await fetch(`${API}/check-id?id=${enteredUsername}`);
        const data = await response.json();
        setUsernameAvailable(data.available);
        if (!data.available) {
          alert('이미 사용 중인 아이디입니다.');
        }
      } catch (error) {
        console.error('Error during ID availability check:', error);
      }
    }
  };

  return (
    <section>
      {login ? (
        <>
          <form onSubmit={handleLoginSubmit}>
            <FormInput label="아이디" name="username" value={username} onChange={(e) => setUsername(e.target.value)} /> {/* 'id'를 'username'으로 변경 */}
            <FormInput label="비밀번호" name="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" text="로그인" />
          </form>
          <Button 
            text="계정이 없습니다." 
            className={styles.noAccount} 
            handle={() => setLogin(false)} 
          />
        </>
      ) : (
        <>
          <form onSubmit={handleRegisterSubmit}>
            <FormInput label="아이디" name="username" value={username} onChange={checkUsernameAvailability} /> {/* 'id'를 'username'으로 변경 */}
            <FormInput label="비밀번호" name="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <FormInput label="비밀번호 재입력" name="rePw" type="password" value={rePassword} onChange={(e) => setRePassword(e.target.value)} />
            <FormInput label="실명" name="name" value={name} onChange={(e) => setName(e.target.value)} />
            <FormInput 
              label="농업 유경험" 
              name="work" 
              type="checkbox" 
              checked={work} 
              onChange={(e) => setWork(e.target.checked)} 
            />
            <Button 
              type="submit" 
              text="회원가입" 
              disabled={!usernameAvailable} // 아이디 중복 검사 후 사용 가능해야만 가입 가능
            />
          </form>
          <Button 
            text="계정이 있습니다." 
            className={styles.noAccount} 
            handle={() => setLogin(true)} 
          />
        </>
      )}
    </section>
  );
}



function App() {
  const viewList = {
    "둘러보기": <Catalog />,
    "등록하기": <Regist />,
    "소통마당": <Community />,
  };

  const [view, setView] = useState(viewList["둘러보기"]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // 백엔드에서 로그인 상태를 확인하는 API 호출
    fetch(`${API}/check-login`, {
      credentials: 'include'  // 쿠키 포함 옵션 (필요 시)
    })
      .then(response => response.json())
      .then(data => {
        if (data.loggedIn) {
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      })
      .catch(error => {
        console.error('Error fetching login status:', error);
        setLoggedIn(false);
      });
  }, []); // 빈 배열은 컴포넌트가 마운트될 때만 호출되게 함

  const handleViewChange = (key) => {
    if (key === "로그인") {
      setView(<Login handle={handleViewChange} setLoggedIn={setLoggedIn} />);
    } else {
      setView(viewList[key]);
    }
  };

  return (
    <div className={styles.App}>
      <header className="App-header">
        <NavBar list={viewList} handle={handleViewChange} loggedIn={loggedIn} />
      </header>
      <Main view={view} />
    </div>
  );
}

export default App;
