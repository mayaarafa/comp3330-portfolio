import Script from "next/script";

export default function GitHubCalendar({ username }) {
  return (
    <div className="scale-70">
      <Script src="https://cdn.jsdelivr.net/gh/imananoosheh/github-contributions-fetch@latest/github_calendar_widget.js" />
      <div
        id="calendar-component"
        username={username}
        background-color="#ffffff"
        theme-color="#000000"
      ></div>
    </div>
  );
}
