import { useState } from "react";
import { login } from "../api/authApi";
import { NavLink, useNavigate } from "react-router-dom";
import styles from "../components/LoginPage.module.css";

export default function LoginPage() {
  const [isSubmitted, setSubmit] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitted) return;

    try {
      setSubmit(true);
      setErrorMessage("");
      await login(email, password);
      setEmail("");
      setPassword("");
      navigate(`/`);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.",
      );
    } finally {
      setSubmit(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <span className={styles.label}>Welcome Back</span>
            <h1 className={styles.title}>다시 돌아오셨네요</h1>
            <p className={styles.description}>
              저장해둔 음악과 플레이리스트를 이어서 확인해보세요.
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className={styles.content}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>로그인</h2>
            <p className={styles.panelDescription}>
              계정 정보를 입력하면 바로 이용할 수 있어요.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.labelText}>이메일</label>
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.labelText}>비밀번호</label>
              <input
                className={styles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력해 주세요"
                required
              />
            </div>

            {errorMessage && <div className={styles.error}>{errorMessage}</div>}

            <div className={styles.actionRow}>
              <button
                type="submit"
                className={styles.primaryBtn}
                disabled={isSubmitted}
              >
                {isSubmitted ? "로그인 중..." : "로그인"}
              </button>
            </div>
          </form>

          <div className={styles.bottomRow}>
            <span className={styles.bottomText}>아직 계정이 없으신가요?</span>
            <NavLink to="/signup" className={styles.signupLink}>
              회원가입
            </NavLink>
          </div>
        </div>
      </section>
    </div>
  );
}
