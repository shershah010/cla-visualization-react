import React from 'react';
import Navbar from './navbar';
import { Container } from 'react-bootstrap';

import './tutorial.css';

const Tutorial = () => {

  return (
    <div>
      <Navbar />
      <Container>

      <h2>Platform Tutorial</h2>

      <iframe
        width="800"
        height="500"
        src="https://www.youtube.com/embed/4PQVq8lgBzg?rel=0"
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>

<h2>Guide to Course Load Analytics</h2>

<details>
    <summary><b>What's the Origin Story of Course Load Analytics?</b></summary>
      <p>This platform provides AI-based predictions of course workload, which we call “Course Load Analytics.”
</p><p>Course load analytics are machine-learned predictions trained on data from past students at your institution (<a href='https://dl.acm.org/doi/pdf/10.1145/3576050.3576081' target='_blank' rel="noreferrer">Borchers & Pardos, 2023</a>).
These students rated the workload of courses they took every week and at the end of the semester.
</p><p>Predictions leverage course-level data from the learning management system (e.g., Moodle, Canvas, Edmodo) and enrollment records (e.g., grade data and co-enrollment sequences).
</p><p>
These predictions are a more accurate representation of student workload perceptions than institutionally provided credit hours (<a href='https://www.sciencedirect.com/science/article/pii/S1096751622000380' target='_blank' rel='noreferrer'>Pardos et al., 2023</a>).
</p><p>
Course Load Analytics break down into three dimensions, in line with common defintions of workload from psychology (<a href='https://www.sciencedirect.com/science/article/pii/S0166411508623870' target='_blank' rel='noreferrer'>Reid & Nygren, 1988</a>):
</p><p>
<ul>
<li><b>Time load</b> refers to the weekly time spent on coursework.
</li><li><b>Mental effort</b> refers to the concentration and attention required for course completion.
</li><li><b>Psychological</b> stress refers to the confusion, frustration, and anxiety during the completion of coursework.
</li></ul>
<p><i><b>It is important to remember that all estimates represent past data and the average student's experience at your institution.
Your personal experience of workload might differ, depending on several personal factors.</b></i>
</p></p>
</details>

<details>
    <summary><b>What do the different Course Load Analytics predictions mean?</b></summary>
    
    <details>
        <summary><b>Time Load</b></summary>
        <p>Time load is defined as the amount of required attention or concentration related to the completion of coursework and attendance.</p>

        <p class="range">Range: 1 (0-5 hours per week) to 5 (21+ hours per week)</p>


        <div className="scale-container">
    <div className="scale-header">Hours per Week:</div>
    <table className="scale-table">
        <thead>
            <tr>
                <th>Range</th>
                <th>Scale Number</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>0-5</td>
                <td>1</td>
            </tr>
            <tr>
                <td>6-10</td>
                <td>2</td>
            </tr>
            <tr>
                <td>11-15</td>
                <td>3</td>
            </tr>
            <tr>
                <td>16-20</td>
                <td>4</td>
            </tr>
            <tr>
                <td>21+</td>
                <td>5</td>
            </tr>
        </tbody>
    </table>
</div>


        <details>
            <summary><b>Click here to see example predictions for time load</b></summary>
        <table>
            <thead>
                <tr>
                    <th>Prediction</th>
                    <th>Top Three Features</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>High Time Load (4.7)</td>
                    <td>Closely Parallel Assignments: 8, Forum Posts per Student: 25, Credit Hours: 3</td>
                </tr>
                <tr>
                    <td>Moderate Time Load (3.3)</td>
                    <td>Assignments: 13, Forum Posts per Student: 20, Closely Parallel Assignments: 4</td>
                </tr>
                <tr>
                    <td>Low Time Load (2.1)</td>
                    <td>Forum Posts per Student: 15, Credit Hours: 2, Assignments: 9</td>
                </tr>
            </tbody>
        </table>
    </details>
</details>







<details>
<summary><b>Mental Effort</b></summary>
        
        <p>Mental effort is defined as the amount of required attention or concentration related to the completion of coursework and attendance.</p>

        <p class="range">Range: 1 (A very low amount) to 5 (A very high amount)</p>

        <div className="scale-container">
    <div className="scale-header">Mental Effort:</div>
    <table className="scale-table">
        <thead>
            <tr>
                <th>Description</th>
                <th>Scale Number</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>A very low amount</td>
                <td>1</td>
            </tr>
            <tr>
                <td>A low amount</td>
                <td>2</td>
            </tr>
            <tr>
                <td>A moderate amount</td>
                <td>3</td>
            </tr>
            <tr>
                <td>A high amount</td>
                <td>4</td>
            </tr>
            <tr>
                <td>A very high amount</td>
                <td>5</td>
            </tr>
        </tbody>
    </table>
</div>


        
        <details>
            <summary><b>Click here to see example predictions for mental effort</b></summary>
        
        <table>
            <thead>
                <tr>
                    <th>Prediction</th>
                    <th>Top Three Features</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>High Mental Effort (4.6)</td>
                    <td>GPA Spread: 3.1, Number of Prerequisites: 6, Number of Graded Assignments: 25</td>
                </tr>
                <tr>
                    <td>Moderate Mental Effort (3.4)</td>
                    <td>Number of Graded Assignments: 18, GPA Spread: 2.2, Credit Hours: 2</td>
                </tr>
                <tr>
                    <td>Low Mental Effort (2.5)</td>
                    <td>Number of Prerequisites: 2, Number of Graded Assignments: 12, GPA Spread: 1.9</td>
                </tr>
            </tbody>
        </table>
    </details>
</details>





<details>
            <summary><b>Psychological Stress</b></summary>
        
        <p>Psychological stress is defined as the frequency of confusion, frustration, or anxiety related to the completion of coursework and attendance.</p>

        <p class="range">Range: 1 (Nearly never) to 5 (Nearly always)</p>

        <div className="scale-container">
    <div className="scale-header">Psychological Stress:</div>
    <table className="scale-table">
        <thead>
            <tr>
                <th>Description</th>
                <th>Scale Number</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Nearly never</td>
                <td>1</td>
            </tr>
            <tr>
                <td>Seldom</td>
                <td>2</td>
            </tr>
            <tr>
                <td>Sometimes</td>
                <td>3</td>
            </tr>
            <tr>
                <td>Frequently</td>
                <td>4</td>
            </tr>
            <tr>
                <td>Nearly always</td>
                <td>5</td>
            </tr>
        </tbody>
    </table>
</div>


        <details>
            <summary><b>Click here to see example predictions for psychological stress</b></summary>
        <table>
            <thead>
                <tr>
                    <th>Prediction</th>
                    <th>Top Three Features</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>High Psychological Stress (4.4)</td>
                    <td>Assignments Announced Close to Deadline: 7, Course GPA: 2.9, Instructor Reply Time: 48 hours</td>
                </tr>
                <tr>
                    <td>Moderate Psychological Stress (3.2)</td>
                    <td>Instructor Reply Time: 30 hours, Assignments Announced Close to Deadline: 5, Course GPA: 3.2</td>
                </tr>
                <tr>
                    <td>Low Psychological Stress (2.0)</td>
                    <td>Course GPA: 3.8, Instructor Reply Time: 2 hours, Low Course GPA: 1.7</td>
                </tr>
            </tbody>
        </table>
    </details>
</details>

</details>


<h2>FAQ for Students</h2>

<details>
    <summary><b>What is the Course Load Analytics (CLA) platform and how can it help me?</b></summary>
    <p>CLA is a tool that helps you understand the expected workload of your courses, beyond just credit hours. You can select and store course selections to study your present and future semester's expected time commitment, mental effort, and stress to give you a clearer picture of what to expect, helping you make informed decisions about your course selection.</p>
</details>

<details>
    <summary><b>How does CLA differ from looking at credit hours?</b></summary>
    <p>Credit hours only tell part of the story. CLA considers additional factors like assignments, exams, and required study time, which better reflect student workload experiences of a course. This can help you avoid overloading yourself.</p>
</details>

<details>
    <summary><b>Can CLA help me if I struggle with course load?</b></summary>
    <p>CLA identifies courses that may have higher workloads or stress levels at particular weeks, allowing you to plan ahead. If you notice a course might be challenging, you can seek support early, like tutoring or study groups, to help manage the load.</p>
</details>

<details>
    <summary><b>What should I do if my CLA shows a high predicted workload?</b></summary>
    <p>If your CLA indicates a high workload, consider balancing your schedule with less demanding courses. You might also talk to your academic advisor about strategies to manage your time and reduce stress.</p>
</details>

<details>
    <summary><b>How can I access my course load analytics for courses I am taking right now and plan to take in the future?</b></summary>
    <p>You can access your CLA through the student portal. If you have trouble finding it, reach out to your academic advisor for guidance. <i>Please not that not all students have access to the CLA platform through their student portal.</i></p>
</details>

<details>
    <summary><b>Does CLA take into account my personal study habits?</b></summary>
    <p>CLA provides a general estimate based on typical student data and perceptions, but it doesn't account for individual study habits or your individual strengths. You should consider your own study style and time management skills when interpreting the results and remember that they may not reflect your unique college experience.</p>
</details>

<details>
    <summary><b>Can CLA predict how much stress I'll experience in a course?</b></summary>
    <p>CLA can indicate courses with higher psychological stress based on past student experiences, but individual stress levels can vary. It's a helpful tool for anticipating challenges, but your experience may differ.</p>
</details>

<details>
    <summary><b>How often is the data in CLA updated?</b></summary>
    <p>CLA data is updated about once a semester, trying to accommodate new courses.</p>
</details>

<details>
    <summary><b>Is CLA available for all courses at my university?</b></summary>
    <p>CLA is typically available for most courses, but there may be some exceptions, especially for new or specialized courses. Ask your academic advisor about a course of interest if you cannot find a course in the CLA platform course catalog.</p>
</details>

<details>
    <summary><b>Can CLA help me if I'm a first-year student?</b></summary>
    <p>Yes, CLA is especially useful for first-year students as it can help you understand the workload expectations before you've had much experience with college courses. It can guide you in choosing a balanced course load, which is important as research indicates that course workload is especially different from credit hours for first-year students (<a href='https://dl.acm.org/doi/pdf/10.1145/3576050.3576081' target='_blank' rel="noreferrer">Borchers & Pardos, 2023</a>).</p>
</details>

<details>
    <summary><b>What if I disagree with the workload prediction for a course?</b></summary>
    <p>CLA predictions are based on past data averaging student workload experiences at your institution and may not always match your personal experience. It is not uncommon find a course easier or harder than CLA predicted as many factors tie into your unique workload experience.</p>
</details>

<details>
    <summary><b>Can CLA help me with long-term academic planning?</b></summary>
    <p>Absolutely! CLA can be a valuable tool for long-term planning by helping you understand workload trends across semesters. Use it to create a balanced academic plan that avoids overloading any single semester.</p>
</details>

<h2>Resources for Academic Advisors</h2>

<details>
    <summary><b>How can I use course load analytics during academic advising?</b></summary>
    <p>Course Load Analytics (CLA) are designed to help academic advisors guide students in (1) course selection and (2) workload mangement during the semester by providing insights into the expected workload. Advisors can help students make informed decisions that balance their academic responsibilities with their personal well-being (<a href='https://orca.cardiff.ac.uk/id/eprint/126022/1/H-Workload3_AndySmith_studentworkload_camera+ready_final.pdf' target='_blank' rel='noreferrer'>Smith, 2019</a>). During advising sessions, CLA can be used to:</p>
    <ul>
        <li>Identify courses that may have high workloads, especially in contrast to expected work based on credit hour designations, and discuss strategies to manage them.</li>
        <li>Discuss courses that are high in mental workload or psychological stress beyond time-based workload measures, including credit hours, as they may require more prerequisite knowledge or feature intensive schedules.</li>
        <li>Prepare for overlapping spikes in workload during specific week of the semester and adequately prepare for them.</li>
        <li>Support students in choosing a semester load that aligns with their capacity and goals.</li>
    </ul>
</details>

<details>
    <summary><b>How are course load analytics helping advisors and students?</b></summary>
    <p>Course Load Analytics (CLA) plays a crucial role in helping students manage their course selection and workload effectively. Research by <a href='https://educationaldatamining.org/edm2024/proceedings/2024.EDM-short-papers.41/2024.EDM-short-papers.41.pdf' target='_blank' rel='noreferrer'>Borchers et al. (2024)</a> highlights the challenges that arise from procrastination during course enrollment, including the increased likelihood of late drops and the mismanagement of workloads. CLA provides actionable insights that can assist advisors in supporting students by:</p>
    <ul>
        <li>Help students identify risks of overloading themselves due to late enrollment decisions.</li>
        <li>Providing early warnings to students who might take on more workload than their credit hours suggest.</li>
        <li>The system as part of advising encourages proactive course planning to avoid last-minute decisions that lead to academic penalties.</li>
        <li>Enable advisors to offer personalized advice to help students balance their course loads and reduce stress.</li>
    </ul>
</details>


<details>
    <summary><b>What research evidence exists regarding course load analytics?</b></summary>
    <p>Course Load Analytics (CLA) offers valuable insights that go beyond traditional credit hour analysis. Key research findings demonstrate the effectiveness of CLA in understanding and predicting course load, including:</p>
    <ul>
        <li>LMS features explain six times more course load variance (36%) than credit hours alone (6%) (<a href='https://www.sciencedirect.com/science/article/pii/S1096751622000380' target='_blank' rel='noreferrer'>Pardos et al., 2023</a>).</li>
        <li>Psychological stress has been described as least manageable by students compared to time load and mental effort (<a href='https://www.sciencedirect.com/science/article/pii/S1096751622000380' target='_blank' rel='noreferrer'>Pardos et al., 2023</a>).</li>
        <li>Courses with more prerequisites tend to have higher predicted workloads (<a href='https://dl.acm.org/doi/pdf/10.1145/3576050.3576081' target='_blank' rel="noreferrer">Borchers & Pardos, 2023</a>).</li>
        <li>Student's first semester at the university is among their highest load semesters, contrary to credit hour-based analysis, which suggests it is among the lowest (<a href='https://dl.acm.org/doi/pdf/10.1145/3576050.3576081' target='_blank' rel="noreferrer">Borchers & Pardos, 2023</a>).</li>
    </ul>
</details>

<details>
    <summary><b>How has CLA been validated?</b></summary>
    <p>
    In creating workload predictions, we replicated machine learning methods used for training, curation, and validation previously performed at UC Berkeley (<a href='https://dl.acm.org/doi/pdf/10.1145/3576050.3576081' target='_blank' rel="noreferrer">Borchers & Pardos, 2023</a>), 
    We confirmed significant improvements in predictive accuracy on a holdout test set generalizing to new courses for each subdimension compared to a mean prediction baseline, with mean abolute errors of about 0.5 scale points for predictions. These improvements correspond to about 20% error reduction to baseline and improvements comparable to those reported in the original validation study of CLA.
    In addition, we replicated findings reported in <a href='https://www.sciencedirect.com/science/article/pii/S1096751622000380' target='_blank' rel='noreferrer'>Pardos et al., 2023</a> regarding variance explained in student workload perceptions at this institution as one form of validation of our engineered LMS and enrollment record features used for predictive modeling.
    Finally, we validated weekly predictions of workload sourced from 40 students through correlations with end-of-semester workload perceptions of about 60 students. Average weekly predictions of courses correlated with those semester perceptions by an average of 0.3, indicating satisfactory validity.
    </p>
</details>

<details>
    <summary><b>How does not using the LMS in a specific course affect workload predictions?</b></summary>
    <p>
    In scenarios where LMS data is unavailable, workload predictions are still feasible but rely more heavily on alternative data sources, such as historical enrollment records. Control variables of LMS availability used in modeling help adjust for the lack of LMS interaction data by incorporating institutional trends in workload expectations, rather than behaviors encoded in LMS data.
    We expect that the predictive models become more agnostic to course-level fluctuations throughout the term, and instead, predicts weekly trends based on broader institutional trends and averages. 
    Hence, without LMS data, we expect workload fluctuations to reflect institutional averages more closely, with less sensitivity to individual weekly deviations. Thus, the predictions would provide a general overview of workload demands for a given course, but might lack some of the granularity provided by LMS activity data seen in other courses.
    </p>
</details>

<h2>References</h2>
<ul>
    <li><a href='https://dl.acm.org/doi/pdf/10.1145/3576050.3576081' target='_blank' rel="noreferrer">Borchers, C., & Pardos, Z. A. (2023). Insights into undergraduate pathways using course load analytics. In LAK23: 13th International Learning Analytics and Knowledge Conference (pp. 219-229).</a></li>
    <li><a href='https://educationaldatamining.org/edm2024/proceedings/2024.EDM-short-papers.41/2024.EDM-short-papers.41.pdf' target='_blank' rel='noreferrer'>Borchers, C., Xu, Y., & Pardos, Z. A. (2024). Are You an Early Dropper or Late Shopper? Mining Enrollment Transaction Data to Study Procrastination in Higher Education.</a></li>
    <li><a href='https://www.sciencedirect.com/science/article/pii/S1096751622000380' target='_blank' rel='noreferrer'>Pardos, Z. A., Borchers, C., & Yu, R. (2023). Credit hours is not enough: Explaining undergraduate perceptions of course workload using LMS records. The Internet and Higher Education, 56, 100882.</a></li>
    <li><a href='https://www.sciencedirect.com/science/article/pii/S0166411508623870' target='_blank' rel='noreferrer'>Reid, G. B., & Nygren, T. E. (1988). The subjective workload assessment technique: A scaling procedure for measuring mental workload. In Advances in psychology (Vol. 52, pp. 185-218). North-Holland.</a></li>
    <li><a href='https://orca.cardiff.ac.uk/id/eprint/126022/1/H-Workload3_AndySmith_studentworkload_camera+ready_final.pdf' target='_blank' rel='noreferrer'>Smith, A. P. (2019). Student workload, wellbeing and academic attainment. In Human Mental Workload: Models and Applications: Third International Symposium, H-WORKLOAD 2019, Rome, Italy, November 14–15, 2019, Proceedings 3 (pp. 35-47). Springer International Publishing.</a></li>
</ul>


<h2>Contact</h2>
<div>Conrad Borchers (cborcher [at] cs.cmu.edu)</div>
<div>Zachary A. Pardos (pardos [at] berkeley.edu)</div>
<div>Micah Modell (Micah.Modell [at] msmc.edu)</div>


      </Container>
    </div>
  );
};

export default Tutorial;
