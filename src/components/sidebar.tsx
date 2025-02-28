import {
  Font,
  fonts,
  Theme,
  themes,
  useSettingsStore,
} from "../stores/settings";

export default function Sidebar() {
  const {
    font,
    theme,
    showNextQuestion,
    showPreviousQuestion,
    enableSound,
    setFont,
    setTheme,
    setShowPreviousQuestion,
    setShowNextQuestion,
    setEnableSound,
  } = useSettingsStore();

  return (
    <div className="drawer drawer-end z-50">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <label
          htmlFor="my-drawer-4"
          className="drawer-button btn btn-primary btn-sm"
        >
          <svg
            className="size-4 text-primary-content"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              fillRule="evenodd"
              d="M9.586 2.586A2 2 0 0 1 11 2h2a2 2 0 0 1 2 2v.089l.473.196.063-.063a2.002 2.002 0 0 1 2.828 0l1.414 1.414a2 2 0 0 1 0 2.827l-.063.064.196.473H20a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-.089l-.196.473.063.063a2.002 2.002 0 0 1 0 2.828l-1.414 1.414a2 2 0 0 1-2.828 0l-.063-.063-.473.196V20a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-.089l-.473-.196-.063.063a2.002 2.002 0 0 1-2.828 0l-1.414-1.414a2 2 0 0 1 0-2.827l.063-.064L4.089 15H4a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h.09l.195-.473-.063-.063a2 2 0 0 1 0-2.828l1.414-1.414a2 2 0 0 1 2.827 0l.064.063L9 4.089V4a2 2 0 0 1 .586-1.414ZM8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <div className="menu bg-base-200 text-base-content min-h-full w-96 p-4">
          <h2 className="text-xl font-semibold text-center">Settings</h2>
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Theme</legend>
            <select
              defaultValue={theme}
              className="select"
              onChange={(e) => setTheme(e.target.value as Theme)}
            >
              {themes.map((theme) => (
                <option key={theme.value} value={theme.value}>
                  {theme.name}
                </option>
              ))}
            </select>

            <legend className="fieldset-legend">Font</legend>
            <select
              defaultValue={font}
              className="select"
              onChange={(e) => setFont(e.target.value as Font)}
            >
              {fonts.map((font) => (
                <option key={font.value} value={font.value}>
                  {font.name}
                </option>
              ))}
            </select>

            <legend className="fieldset-legend">Test options</legend>
            <label className="fieldset-label">
              <input
                type="checkbox"
                className="toggle"
                checked={showPreviousQuestion}
                onChange={(e) => setShowPreviousQuestion(e.target.checked)}
              />
              Show previous question
            </label>

            <legend className="fieldset-legend">Test options</legend>
            <label className="fieldset-label">
              <input
                type="checkbox"
                className="toggle"
                checked={showNextQuestion}
                onChange={(e) => setShowNextQuestion(e.target.checked)}
              />
              Show next question
            </label>

            <legend className="fieldset-legend">Sound</legend>
            <label className="fieldset-label">
              <input
                type="checkbox"
                className="toggle"
                checked={enableSound}
                onChange={(e) => setEnableSound(e.target.checked)}
              />
              Enable sound
            </label>
          </fieldset>
        </div>
      </div>
    </div>
  );
}
