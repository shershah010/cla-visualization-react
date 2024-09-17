import React, { useEffect } from "react";
import { useGlobalState } from "./globalState";
import { useNavigate } from "react-router";
import { Button } from "react-bootstrap";
import { AWS_ENDPOINT } from "../config";

import "./consentForm.css";

const ConsentForm = () => {
  const [globalState, setGlobalState] = useGlobalState();
  const navigate = useNavigate();

  const handleConsentConfirmation = async () => {
    const lambdaResponse = await fetch(`${AWS_ENDPOINT}/consent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: globalState.user.user_id,
      }),
    });

    if (lambdaResponse.ok) {
      const responseData = await lambdaResponse.json();
      setGlobalState("user", responseData.user);
      navigate("/");
    }
  };

  useEffect(() => {
    if (!globalState.isAuthenticated) {
      navigate("/login");
    }

    if (globalState.user.completed_consent) {
      navigate("/");
    }
  });

  return (
    <div className="consent-form">
      <h1>
        CONSENT TO PARTICIPATE IN RESEARCH <br /> Course Load Analytics for
        Academic Advising
      </h1>

      <div className="section">
        <h2>Key Information</h2>
        <ul>
          <li>
            You are being invited to participate in a research study.
            Participation in research is completely voluntary.
          </li>
          <li>
            The purpose of the study is to investigate how the provision of
            novel course workload analytics improves academic outcomes and
            well-being.
          </li>
          <li>
            If you agree to participate, your academic grades, dropped courses,
            course enrollments, and withdrawal from their program and university
            where applicable is collected for research purposes at the end of
            the semester.
          </li>
          <li>
            You will be randomly assigned to an intervention or control
            condition based on your academic advisor. If you are assigned to the
            intervention platform, you will receive access to a novel platform
            displaying advanced course workload analytics of courses at your
            institution.
          </li>
          <li>
            If you agree to participate, your interactions with and accesses of
            the platform are logged and linked to your academic information.
          </li>
          <li>
            Risks and/or discomforts may include the risk of breach of
            confidentiality.
          </li>
          <li>
            There are no direct benefits to participants, but participants in
            the intervention condition might experience improved academic
            outcomes and reduced course-related stress.
          </li>
        </ul>
      </div>

      <div className="section">
        <h2>Introduction</h2>
        <p>
          My name is Professor Zachary Pardos. I am a faculty member at the
          University of California, Berkeley, in the Graduate School of
          Education. I am planning to conduct a research study, which I invite
          you to take part in.
        </p>
      </div>

      <div className="section">
        <h2>Purpose</h2>
        <p>
          The purpose of this research study is to understand the influence of
          the availability of advanced course workload analytics (related to
          time load, mental effort, and psychological stress) on academic
          outcomes and well-being throughout an academic semester.
        </p>
      </div>

      <div className="section">
        <h2>Procedures</h2>
        <p>
          If you agree to be in this study, you will be asked to do the
          following: Students are randomly assigned to the intervention and
          control condition based on their assigned academic advisor.
          Intervention students who consented receive an additional link on
          their advising platform that redirects them to the course load
          analytics (CLA) dashboard. The CLA dashboard platform assigns an anonymous 
          ID for tracking based on their
          institutional SSO login. Logging of platform use includes time of page
          access, number of page accesses, time spent, and timestamped
          clickstream data/clicks. The platform includes weekly and overall CLA
          analytics for each course the student is currently enrolled in, and
          the student can also look up courses and their CLA. The CLA dashboard
          platform remains available throughout the semester. At the end of the
          semester, a summary report of de-identified students’ interactions with the CLA
          platform, their academic grades, dropped courses, course enrollments,
          and withdrawal from their program and university (where applicable) is
          collected and shared with investigators at UC Berkeley.
        </p>
      </div>

      <div className="section">
        <h2>Study Time</h2>
        <p>
          All use of the CLA dashboard is completely optional, hence no study time estimate
          is available.
        </p>
      </div>

      <div className="section">
        <h2>Study Location</h2>
        <p>All study procedures will take place online.</p>
      </div>

      <div className="section">
        <h2>Benefits</h2>
        <p>
          We hope that the information gained from the study will help us
          improve academic advising. There are no direct benefits to you for
          participating in this study, but participants in the intervention
          condition might experience improved academic outcomes and reduced
          course-related stress.
        </p>
      </div>

      <div className="section">
        <h2>Risks/Discomforts</h2>
        <p>
          Course load analytics may influence your course selection decisions
          while being in itself an imperfect measure (i.e., prediction) of
          actual workload. Hence, we cannot rule out the possibility that our
          intervention will discourage you from taking courses that would have
          otherwise benefitted you (more than other courses) or encourage you to
          take courses that have surprising levels of workload or other
          suboptimal outcomes for you, such that you would drop that course.
        </p>
      </div>

      <div className="section">
        <h2>Breach of Confidentiality</h2>
        <p>
          As with all research, there is a chance that confidentiality could be
          compromised; however, we are taking precautions to minimize this risk.
        </p>
      </div>

      <div className="section">
        <h2>Confidentiality</h2>
        <p>
          Your study data will be handled as confidentially as possible. If
          results of this study are published or presented, individual names and
          other personally identifiable information will not be used.
        </p>
        <p>
          To minimize the risks to confidentiality, we will do the following:
        </p>
        <ul>
          <li>
            We will not maintain a link between your identity and the research
            data.
          </li>
          <li>
            Your anonymous academic records will not be identifiable to us.
          </li>
          <li>
            Your encrypted research records will be stored on a
            password-protected computer until they are deleted.
          </li>
          <li>Only the researchers will have access to your study records.</li>
        </ul>
        <p>
          All study data will only be stored on the AskOski server, which is
          certified to process sensitive educational data and hosted at UC
          Berkeley Data Center. The certification is of Protection Level P3 (see{" "}
          <a href="https://security.berkeley.edu/data-classification-standard">
            https://security.berkeley.edu/data-classification-standard
          </a>
          ). Your data will be protected by only granting access to the data on
          the AskOski server via remote, encrypted SSH access for analysis
          purposes.
        </p>
        <p>
          Your personal information may be released if required by law.
          Authorized representatives from the following organizations may review
          your research data for purposes such as monitoring or managing the
          conduct of this study: University of California.
        </p>
        <p>
          Identifiers might be removed from the identifiable private
          information. After such removal, the information could be used for
          future research studies or distributed to other investigators for
          future research studies without additional informed consent from the
          subject or the legally authorized representative.
        </p>
      </div>

      <div className="section">
        <h2>Future Use of Study Data</h2>
        <p>
          De-identified data will be retained indefinitely for possible use in
          future research done by ourselves or others. The same measures
          described above will be taken to protect the confidentiality of this
          study data.
        </p>
      </div>

      <div className="section">
        <h2>Compensation/Payment</h2>
        <p>
          You will not receive compensation for participating in this study.
        </p>
      </div>

      <div className="section">
        <h2>Costs</h2>
        <p>You will not be charged for any of the study activities.</p>
      </div>

      <div className="section">
        <h2>Rights</h2>
        <p>
          Participation in research is completely voluntary. You have the right
          to decline to participate or to withdraw at any point in this study
          without penalty or loss of benefits to which you are otherwise
          entitled.
        </p>
      </div>

      <div className="section">
        <h2>Questions</h2>
        <p>
          If you have any questions or concerns about this study, you may
          contact me directly at pardos@berkeley.edu.
        </p>
        <p>
          If you have any questions or concerns about your rights and treatment
          as a research subject, you may contact the office of UC Berkeley's
          Committee for the Protection of Human Subjects, at 510-642-7461 or
          subjects@berkeley.edu.
        </p>
        <p>
          You are choosing to participate in this study. You can withdraw from
          this study at any time for any reason. For any additional questions or
          concerns pertaining to this study, please feel free to contact Zachary
          A. Pardos 321-219-9224 pardos@berkeley.edu or the Chairs of the IRB
          committee at Mount Saint Mary College: Jodie Fahey 845-569-3555
          jodie.fahey@msmc.edu and Eunyoung Jung 845-569-3460
          eunyoung.jung@msmc.edu.
        </p>
      </div>

      <div className="section">
        <h2>Consent</h2>
        <p>
          To participate in this study, please confirm your consent by checking
          the box labeled "ACKNOWLEDGE" below. You may download or print a copy 
          of this consent form for your records.
        </p>
        <Button className="button" onClick={handleConsentConfirmation}>
          ACKNOWLEDGE
        </Button>
      </div>
    </div>
  );
};

export default ConsentForm;
