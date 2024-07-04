import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Objects from "./components/Objects";
import Buckets from "./components/Buckets";
import Backups from "./components/Backups";
import BucketBackups from "./components/Buckets/ListBackups";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Objects />
            </Layout>
          }
        />
        <Route
          path="/buckets"
          element={
            <Layout>
              <Buckets />
            </Layout>
          }
        />
        <Route
          path="/backups"
          element={
            <Layout>
              <Backups />
            </Layout>
          }
        />
        <Route
          path="/backups/buckets/:bucketName"
          element={
            <Layout>
              <BucketBackups />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
