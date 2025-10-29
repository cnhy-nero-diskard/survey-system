import { useEffect, useContext, useState, useRef } from "react";
import { useNavigate, useLocation, Router } from "react-router-dom";
import axios from "axios";
import { sroutes as surveyRoutes } from "./surveyRoutesConfig";
import { UnifiedContext } from "./UnifiedContext";

const SurveyStepGuard = ({ route, index, totalSteps }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { activeBlocks, routes, appendActiveBlocks, removeActiveBlocks } = useContext(UnifiedContext);
  const [redirectCount, setRedirectCount] = useState(0);
  const isMounted = useRef(true);

  const getParentPath = (path) => {
    const segments = path.split("/");
    return segments.slice(0, -1).join("/");
  };
  useEffect(() => {
    console.log(`SURVEY STEP GUARD - TRYING TO RENDER COMPONENT - route ${route.path} index ${index}`);

    const validateStepAccess = async () => {
      try {


        console.log(`SSGUARD VERIFYING with active blocks ${JSON.stringify(activeBlocks)}`);
        const response = await axios.get(`${process.env.REACT_APP_API_HOST}/api/survey/progress`, { withCredentials: true });
        let currentStep = response.data.currentStep;
        const parentPath = getParentPath(location.pathname)
        console.log(`PARENT PATH of ${location.pathname} --> ${parentPath}`);
        if (parentPath ===""){
          parentPath = location.pathname
        }
        if (location.pathname === "/survey" || getParentPath(location.pathname) == "/survey" && !activeBlocks.includes("surveytpms")) {
          removeActiveBlocks("feedback");
        } else if (location.pathname === "/feedback" && !activeBlocks.includes("feedback")) {
          removeActiveBlocks("surveytpms");
        }
        // Redirect to the first step if currentStep is 0 and the user is not on the first step
        if (currentStep === 0 && index !== 0) {
          console.log("SSGUARD detected zero currentStep")
          // (comment this so you don't get redirected when debugging)👇👇👇
          // navigate(parentPath);
          return;
        }

        // Handle conditional blocks 

        if (route.conditionalBlock && !activeBlocks.includes(route.conditionalBlock)) {
          console.log(`SSGUARD conditional block ${route.conditionalBlock} not found`);
          let newindex = index;

          // (comment this so you don't get redirected when debugging)👇👇👇
          // while (routes[newindex].conditionalBlock !== 'universal') {
          //   console.log(`SSGUARD route -> ${index}`);
          //   newindex--;
          // }

          await axios.post(`${process.env.REACT_APP_API_HOST}/api/survey/progress`, {
            currentStep: newindex,
          }, { withCredentials: true });


          // navigate(`${parentPath}/${routes[newindex].path}`);
          return;
        }

        // Strict validation: Ensure the user is on the correct step
        if (index !== currentStep) {
          console.log(`SSGUARD invalid entry index of ${index} not matching with currentStep ${currentStep}`);

          setRedirectCount(prevCount => prevCount + 1);

          // Prevent infinite loops by redirecting to 404 after 3 invalid attempts
          if (redirectCount >= 3) {
            console.error("Runaway render detected. Redirecting to 404.");
            navigate("/404");
            return;
          }
          
          // Redirect to the correct step immediately
          // (comment this so you don't get redirected when debugging)👇👇👇
          // navigate(`${parentPath}/${surveyRoutes[currentStep].path}`);
          return;
        }

        // Reset redirect count if the user is on the correct step
        setRedirectCount(0);
      } catch (err) {
        console.error("Error validating step access:", err);
      }
    };

    if (isMounted.current) {
      validateStepAccess();
    }

    return () => {
      isMounted.current = false; // Cleanup on unmount
    };
  }, [navigate, location.pathname, index, route.path, redirectCount, route.conditionalBlock]);

  console.log('SSGUARD - VERIFIED');
  const StepComponent = route.component;
  return <StepComponent />;
};

export default SurveyStepGuard;
