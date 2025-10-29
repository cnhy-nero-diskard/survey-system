// navigationUtils.js
import axios from "axios";
import { useContext, useState } from "react";
export const goToNextStep = async (currentStepIndex, navigate, surveyRoutes, activeBlocks, increment = 1) => {
  console.log(`NAVUTILS - CURRENT STEP = ${currentStepIndex}`);
  
  try {
    // Update progress on the backend
    let nextStepIndex = currentStepIndex + increment;
    console.log(`NAVUTILS - ACTIVE BLOCKS: ${JSON.stringify(activeBlocks)}`);

    // Find the next step that is a part of the active conditional blocks
    while (nextStepIndex < surveyRoutes.length) {
      const nextStep = surveyRoutes[nextStepIndex];
      if (!nextStep.conditionalBlock || activeBlocks.includes(nextStep.conditionalBlock)) {
        break;
      }
      console.log("NAVUTILS - SKIPPING");
      nextStepIndex++;
    }

    await axios.post(`${process.env.REACT_APP_API_HOST}/api/survey/progress`, {
      currentStep: nextStepIndex,
    }, { withCredentials: true });

    // Get the next step from the surveyRoutes array
    const nextStep = surveyRoutes[nextStepIndex];

    if (nextStep) {
      console.log(`NAVUTILS - TO NEXT ROUTE ${nextStep.path}`);
      // Navigate to the next step
  
      if (activeBlocks.includes("surveytpms")) {
        navigate(`/survey/${nextStep.path}`);
      } else if (activeBlocks.includes("feedback")) {
        navigate(`/feedback/${nextStep.path}`);
      } else {
        navigate(`/${nextStep.path}`);
      }
    } else {
      // If there is no next step, navigate to a completion page or home
      navigate("/");
    }
  } catch (err) {
    console.error("Error navigating to the next step:", err);
  }
};