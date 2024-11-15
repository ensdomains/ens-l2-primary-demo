import { Header } from "./components/Header";
import { PrimaryNameDisplay } from "./components/PrimaryNameDisplay";

function App() {
  return (
    <div className="container">
      <div className="layout">
        <Header />
        <PrimaryNameDisplay />
      </div>
    </div>
  );
}

export default App;
