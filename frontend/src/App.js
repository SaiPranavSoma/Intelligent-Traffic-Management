import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./Home";
import Login from "./Login";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import Register from "./Register";
import PublicHome from "./PublicHome";
import PoliceHome from "./PoliceHome";
import AdminHome from "./AdminHome";
import AddPolice from "./AddPolice";
import Payment from "./Payment";
import ReportIncident from "./ReportIncident";
import ViewReports from "./ViewReports";
import Clearreport from "./Clearreport";
import Statusupdate from "./Statusupdate";
import MapComponent from "./MapComponent";
import FileChallan from "./FileChallan";
import ViewChallan from "./ViewChallan";
import ViewFines from "./ViewFines";
import GenerateReport from "./GenerateReport";
import Viewlog from "./Viewlog";
import PublicProfile from "./PublicProfile";
import PoliceProfile from "./PoliceProfile";
import ViewReportsUser from "./ViewReportsUser";
import TrafficVideo from "./TrafficVideo";




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/public-home" element={<PublicHome />} />
        <Route path="/police-home" element={<PoliceHome />} />
        <Route path="/file-challan" element={<FileChallan />} />
        <Route path="/admin-home" element={<AdminHome />} />
        <Route path="/report" element={<ReportIncident />} />
        <Route path="/maps" element={<MapComponent />} />
        <Route path="/clear" element={<Clearreport />} />
        <Route path="/view-challan" element={<ViewChallan />} />
        <Route path="/view" element={<ViewReports />} />
        <Route path="/status" element={<Statusupdate />} />
        <Route path="/add-police" element={<AddPolice />} />
        <Route path="/view-fines" element={<ViewFines />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/generate" element={<GenerateReport />} />
        <Route path="/viewlog" element={<Viewlog />} />
        <Route path="/publicprofile" element={<PublicProfile />} />
        <Route path="/policeprofile" element={<PoliceProfile />} />
        <Route path="/userreport" element={<ViewReportsUser />} />
        <Route path="/TrafficVideo" element={<TrafficVideo />} />
      </Routes>
    </Router>
  );
}

export default App;
