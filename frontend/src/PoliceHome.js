import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const PoliceHome = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <PageWrapper>
      <Header>
        <h1>🚔 Police Dashboard</h1>
        <ButtonContainer>
          <ProfileButton onClick={() => navigate("/policeprofile")}>
            Profile
          </ProfileButton>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </ButtonContainer>
      </Header>


      <GlassyContainer>
        <FeatureSection navigate={navigate} />
      </GlassyContainer>
    </PageWrapper>
  );
};

const FeatureSection = ({ navigate }) => {
  return (
    <FeatureGrid>
      <FeatureBox>
        <h3>🚦 View Reports</h3>
        <p>Monitor and clear traffic violation reports.</p>
        <ActionButton onClick={() => navigate("/clear")}>Clear Report</ActionButton>
      </FeatureBox>

      <FeatureBox>
        <h3>📄 View Challan</h3>
        <p>Check the status of issued challans.</p>
        <ActionButton onClick={() => navigate("/view-challan")}>View Challan</ActionButton>
      </FeatureBox>

      <FeatureBox>
        <h3>📋 Report Challan</h3>
        <p>File a report for traffic violations.</p>
        <ActionButton onClick={() => navigate("/file-challan")}>Report Challan</ActionButton>
      </FeatureBox>

      <FeatureBox>
        <h3>🛑 Emergency Contacts</h3>
        <p>Access emergency contacts for quick assistance.</p>
        <ActionButton onClick={() => navigate("/emergency-contacts")}>View Contacts</ActionButton>
      </FeatureBox>
    </FeatureGrid>
  );
};

export default PoliceHome;

// Styled Components
const PageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background-color: rgb(33, 32, 32);
  padding: 20px;
  color: white;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1400px;
  background: rgb(50, 49, 49);
  padding: 20px 30px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  color: white;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
`;

const LogoutButton = styled.button`
  background-color: red;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s ease;

  &:hover {
    background-color: darkred;
  }
`;

const ProfileButton = styled(LogoutButton)`
  background-color: blue;

  &:hover {
    background-color: darkblue;
  }
`;

const AlertSlider = styled.div`
  width: 100%;
  max-width: 1400px;
  text-align: center;
  background: red;
  color: white;
  padding: 12px;
  font-weight: bold;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 18px;
`;

const GlassyContainer = styled.div`
  background: rgba(35, 35, 35, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 30px;
  width: 60%;
  box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  margin-top: 50px;
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
  width: 100%;
  text-align: center;
`;

const FeatureBox = styled.div`
  background: rgba(80, 75, 75, 0.91) ;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  color: black;  /* Changed from white to black */

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0px 6px 15px rgba(253, 253, 253, 0.99);
  }
`;

const ActionButton = styled.button`
  background: linear-gradient(to right, #007bff, #0056b3);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 10px;
  transition: background 0.3s ease, transform 0.2s ease;

  &:hover {
    background: linear-gradient(to right, #0056b3, #004494);
    transform: scale(1.05);
  }
`;
