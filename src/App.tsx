import { useState } from "react";
import type { FormEvent } from "react";
import type { StudyPeriod, Task } from "./types";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  // 新しく作成するタスクの期間
  const [period, setPeriod] = useState<StudyPeriod>("daily");

  // 一覧で現在表示している期間
  const [selectedPeriod, setSelectedPeriod] =
  useState<StudyPeriod>("daily");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("プログラミング");

  // タスクを追加
  const addTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      category,
      period,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
    setTitle("");
  };

  // 表示するタスクの絞り込み
  const filteredTasks = tasks.filter(
  (task) => task.period === selectedPeriod
  );

  // 完了状態を切り替え
  const toggleTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // タスクを削除
  const deleteTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.filter((task) => task.id !== id)
    );
  };

  // 達成率を計算
  const completedCount = filteredTasks.filter(
    (task) => task.completed
  ).length;

  const progress =
    filteredTasks.length === 0
      ? 0
      : Math.round((completedCount / filteredTasks.length) * 100);

  return (
    <main className="container">
      <header className="header">
        <p className="eyebrow">wanna be</p>
        <h1>Study Every</h1>
        <p>継続は力なり。</p>
      </header>

      <section className="progress-card">
        <div className="progress-info">
          <span>
            {selectedPeriod === "daily"
              ? "デイリーのタスク達成率"
              : selectedPeriod === "weekly"
                ? "ウィークリーのタスク達成率"
                : "マンスリーのタスク達成率"}
          </span>
          <strong>{progress}%</strong>
        </div>

        <div
          className="progress-track"
          role="progressbar"
          aria-label="タスク達成率"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p>
          {completedCount} / {filteredTasks.length} 件完了
        </p>
      </section>

      <section className="form-card">
        <h2>新しい学習タスク</h2>

        <form onSubmit={addTask}>
          <label htmlFor="task-title">学習内容</label>
          <input
            id="task-title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="例：ReactのuseStateを学ぶ"
            maxLength={100}
            required
          />

          <label htmlFor="task-category">学習分野</label>
          <select
            id="task-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option>プログラミング</option>
            <option>英語</option>
            <option>資格勉強</option>
            <option>読書</option>
            <option>その他</option>
          </select>

          <label htmlFor="task-period">タスクの期間</label>
          <select
            id="task-period"
            value={period}
            onChange={(event) =>
              setPeriod(event.target.value as StudyPeriod)
            }
          >
            <option value="daily">デイリー</option>
            <option value="weekly">ウィークリー</option>
            <option value="monthly">マンスリー</option>
          </select>

          <button type="submit" className="add-button">
            ＋ タスクを追加
          </button>
        </form>
      </section>

      <section className="tasks-section">
        <h2>学習タスク一覧</h2>

        <div className="period-tabs">
          <button
            type="button"
            onClick={() => setSelectedPeriod("daily")}
            className={selectedPeriod === "daily" ? "active" : ""}
          >
            デイリー
          </button>

          <button
            type="button"
            onClick={() => setSelectedPeriod("weekly")}
            className={selectedPeriod === "weekly" ? "active" : ""}
          >
            ウィークリー
          </button>

          <button
            type="button"
            onClick={() => setSelectedPeriod("monthly")}
            className={selectedPeriod === "monthly" ? "active" : ""}
          >
            マンスリー
          </button>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>まだタスクがありません。</p>
            <p>
              まずは小さな目標を1つ登録してみましょう！
            </p>
          </div>
        ) : (
          <ul className="task-list">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className={`task-item ${
                  task.completed ? "completed" : ""
                }`}
              >
                <label className="task-label">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                  />

                  <span className="task-content">
                    <span className="task-title">
                      {task.title}
                    </span>
                    <span className="task-category">
                      {task.category}
                    </span>
                  </span>
                </label>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => deleteTask(task.id)}
                  aria-label={`${task.title}を削除`}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {completedCount > 0 && (
        <p className="encouragement">
          {progress === 100
            ? "素晴らしい！すべてのタスクを達成しました！"
            : "着実に前進しています。その調子です！"}
        </p>
      )}
    </main>
  );
}

export default App;
