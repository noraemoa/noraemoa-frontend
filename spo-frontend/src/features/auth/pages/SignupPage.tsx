import { useState } from "react";
import { login, signup } from "../api/authApi";
import { useNavigate } from "react-router-dom";
import styles from "../components/SignupPage.module.css";

export default function SignupPage() {
  const [isSubmitted, setSubmit] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitted) return;

    try {
      setSubmit(true);
      setErrorMessage("");
      await signup(email, username, password);
      await login(email, password);
      setEmail("");
      setUsername("");
      setPassword("");
      navigate(`/me/taste-profile/1`);
    } catch (err) {
      console.error(err);
      setErrorMessage(
        "회원가입에 실패했습니다. 입력한 정보를 다시 확인해 주세요.",
      );
    } finally {
      setSubmit(false);
    }
  };

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroCopy}>
            <span className={styles.label}>Welcome</span>
            <h1 className={styles.title}>
              NoraeMoa에 가입하고 노래를 모아보세요.
            </h1>
            <p className={styles.description}>
              간단한 가입 후 밸런스 게임으로 당신의 음악 취향을 정리해드릴게요.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>회원가입</h2>
            <p className={styles.panelDescription}>
              가입이 끝나면 바로 취향 온보딩으로 이어집니다.
            </p>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label className={styles.labelText} htmlFor="email">
                이메일
              </label>
              <input
                id="email"
                className={styles.input}
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.labelText} htmlFor="username">
                닉네임
              </label>
              <input
                id="username"
                className={styles.input}
                type="text"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="서비스에서 표시될 이름"
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.labelText} htmlFor="password">
                비밀번호
              </label>
              <input
                id="password"
                className={styles.input}
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호를 입력해 주세요"
                required
              />
            </div>

            {errorMessage && <div className={styles.error}>{errorMessage}</div>}

            <div className={styles.actionRow}>
              <button
                className={styles.primaryBtn}
                type="submit"
                disabled={isSubmitted}
              >
                {isSubmitted ? "가입 중..." : "가입하고 시작하기"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
