import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled, { keyframes, css } from 'styled-components';
import {
  Person as PersonIcon,
  Warning as WarningIcon,
  SmartToy as RobotIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  ModernContainer,
  SectionHeader,
  ModernForm,
  InputGroup,
  Label,
  ModernInput,
  ModernSelect,
  ModernButton,
  TableSection,
  TableHeader,
  TableContainer,
  ModernTable,
  ModernTableHead,
  ModernTableRow,
  ModernTableCell,
  ActionButtonGroup,
  ActionButton,
  LoadingSpinner,
  EmptyState,
  StatsCard,
} from './styles/SharedStyles';

// Animations
const shake = keyframes`
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(2px, 2px) rotate(2deg); }
  50% { transform: translate(0, 0) rotate(0deg); }
  75% { transform: translate(-2px, 2px) rotate(-2deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
`;

const pulse = keyframes`
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
`;

// Component specific styled components
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
`;

const CustomTableRow = styled(ModernTableRow)`
  font-size: 0.8rem;
  
  ${({ status }) =>
    status === 'AT LEAST ONE ENTRY, HAS COMPLETED' &&
    css`
      background-color: #48bb78 !important;
      color: white;
      
      &:hover {
        background-color: #38a169 !important;
      }
    `}

  ${({ isSpam }) =>
    isSpam &&
    css`
      background-color: #fc8181 !important;
      color: white;
      animation: ${pulse} 2s infinite;
      
      &:hover {
        background-color: #f56565 !important;
      }
    `}
`;

const CustomTableCell = styled(ModernTableCell)`
  ${({ feedback }) =>
    feedback === 'Yes' &&
    css`
      background-color: #f6ad55;
      color: white;
      font-weight: 600;
    `}

  ${({ tpms }) =>
    tpms === 'Yes' &&
    css`
      background-color: rgb(212, 113, 0);
    `}
`;

const DetailsContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(102, 126, 234, 0.1);
  margin: 16px 0;
`;

const GroupedDetails = styled.div`
  margin-bottom: 24px;
`;

const GroupTitle = styled.h5`
  font-size: 18px;
  color: #4a5568;
  margin-bottom: 12px;
  font-weight: 600;
`;

const ResponseItem = styled.div`
  padding: 12px;
  background: rgba(102, 126, 234, 0.05);
  border-radius: 8px;
  margin-bottom: 8px;
  border-left: 4px solid #667eea;
`;

const ResponseText = styled.p`
  margin: 0;
  font-size: 14px;
  color: #4a5568;
  line-height: 1.5;
`;

const Timestamp = styled.small`
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #718096;
`;

const SpamBadge = styled.div`
  display: inline-flex;
  align-items: center;
  background: linear-gradient(135deg, #fc8181 0%, #f56565 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  margin-left: 8px;
`;

const SpamWarningBanner = styled.div`
  padding: 12px;
  background: linear-gradient(135deg, #fc8181 0%, #f56565 100%);
  color: white;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(245, 101, 101, 0.3);
`;

const AnonymousUsersHandler = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [detailsVisible, setDetailsVisible] = useState(null);
  const [surveyQuestions, setSurveyQuestions] = useState([]);
  const [sortCriteria, setSortCriteria] = useState('alphabetical');
  const [spamUsers, setSpamUsers] = useState([]);

  useEffect(() => {
    const fetchAnonymousUsersAndSurveyResponses = async () => {
      try {
        const [usersResponse, spamUsersResponse, surveyResponsesResponse, surveyQuestionsResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_HOST}/api/admin/anonymous-users`, { withCredentials: true }),
          axios.get(`${process.env.REACT_APP_API_HOST}/api/admin/spam-anonymous-users`, { withCredentials: true }),
          axios.get(`${process.env.REACT_APP_API_HOST}/api/admin/survey-responses`, { withCredentials: true }),
          axios.get(`${process.env.REACT_APP_API_HOST}/api/admin/survey-questions`, { withCredentials: true })
        ]);

        const anonymousUsers = usersResponse.data;
        setSpamUsers(spamUsersResponse.data);
        const allSurveyResponses = surveyResponsesResponse.data;
        setSurveyQuestions(surveyQuestionsResponse.data);

        const userSurveyStatus = anonymousUsers.map(user => {
          const userResponses = allSurveyResponses.filter(response => response.anonymous_user_id === user.anonymous_user_id);
          const isSpam = spamUsersResponse.data.some(spamUser => spamUser.anonymous_user_id === user.anonymous_user_id);
          
          let surveyStatus = {
            ...user,
            surveyEntries: userResponses,
            surveyStatus: 'NO SURVEY',
            completionStatus: 'INCOMPLETE',
            feedback: false,
            tpms: false,
            isSpam
          };

          if (userResponses.length > 0) {
            surveyStatus.surveyStatus = 'NOT FINISHED';
            const tpentResponse = userResponses.find(resp => resp.surveyquestion_ref === 'TPENT');
            const finishResponse = userResponses.find(resp => resp.surveyquestion_ref === 'FINISH');

            if (tpentResponse) {
              surveyStatus.feedback = true;
            }
            if (finishResponse) {
              surveyStatus.completionStatus = 'HAS COMPLETED';
            }
            surveyStatus.tpms = true;
          }

          return surveyStatus;
        });

        setUsers(userSurveyStatus);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnonymousUsersAndSurveyResponses();
  }, []);

  const handlePurge = async () => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_HOST}/api/admin/all-anonymous-users`, { withCredentials: true });
      setUsers([]);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleDetails = (userId) => {
    setDetailsVisible(detailsVisible === userId ? null : userId);
  };

  const groupResponsesByTitle = (responses) => {
    return responses.reduce((acc, response) => {
      const matchingQuestion = surveyQuestions.find(
        question => question.surveyresponses_ref === response.surveyquestion_ref
      );
      const title = matchingQuestion ? matchingQuestion.title : 'Uncategorized';

      if (!acc[title]) {
        acc[title] = [];
      }
      acc[title].push(response);
      return acc;
    }, {});
  };

  const sortUsers = (criteria) => {
    let sortedUsers = [...users];

    sortedUsers.sort((a, b) => {
      // Priority 1: Sort by 'Present Data'
      const aHasData = ["AT LEAST ONE ENTRY", "HAS COMPLETED"].includes(a.surveyStatus) ||
                      a.feedback === true || a.tpms === true;
      const bHasData = ["AT LEAST ONE ENTRY", "HAS COMPLETED"].includes(b.surveyStatus) ||
                      b.feedback === true || b.tpms === true;

      if (aHasData && !bHasData) return -1;
      if (!aHasData && bHasData) return 1;

      // Priority 2: Sort by spam status
      if (a.isSpam && !b.isSpam) return -1;
      if (!a.isSpam && b.isSpam) return 1;

      // Priority 3: Sort by the selected criteria
      if (criteria === 'alphabetical') {
        return a.nickname?.localeCompare(b.nickname);
      } else if (criteria === 'created_at') {
        return new Date(a.created_at) - new Date(b.created_at);
      }

      return 0;
    });

    setUsers(sortedUsers);
  };

  const handleSortChange = (e) => {
    const criteria = e.target.value;
    setSortCriteria(criteria);
    sortUsers(criteria);
  };

  if (loading) {
    return (
      <ModernContainer>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <LoadingSpinner />
          <p style={{ marginTop: '16px', color: '#718096' }}>Loading user data...</p>
        </div>
      </ModernContainer>
    );
  }

  if (error) {
    return (
      <ModernContainer>
        <div style={{ textAlign: 'center', padding: '48px', color: '#fc8181' }}>
          <WarningIcon style={{ fontSize: '48px', marginBottom: '16px' }} />
          <h3>Error Loading Data</h3>
          <p>{error}</p>
        </div>
      </ModernContainer>
    );
  }

  return (
    <ModernContainer>
      <SectionHeader>
        <h2>
          <PersonIcon />
          Anonymous Users and Survey Status
        </h2>
        <p>Monitor anonymous users, survey completions, and identify potential spam</p>
      </SectionHeader>

      <StatsGrid>
        <StatsCard>
          <h4>{users.length}</h4>
          <p>Total Users</p>
        </StatsCard>
        <StatsCard>
          <h4>{users.filter(u => u.completionStatus === 'HAS COMPLETED').length}</h4>
          <p>Completed Surveys</p>
        </StatsCard>
        <StatsCard>
          <h4>{users.filter(u => u.feedback).length}</h4>
          <p>With Feedback</p>
        </StatsCard>
        <StatsCard style={{ background: 'linear-gradient(135deg, #fc8181 0%, #f56565 100%)' }}>
          <h4>{users.filter(u => u.isSpam).length}</h4>
          <p>Suspected Spam</p>
        </StatsCard>
      </StatsGrid>

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'end' }}>
        <InputGroup>
          <Label>Sort by</Label>
          <ModernSelect value={sortCriteria} onChange={handleSortChange}>
            <option value="alphabetical">Alphabetical</option>
            <option value="created_at">Created At</option>
            <option value="present_data">Present Data</option>
          </ModernSelect>
        </InputGroup>
        
        <ModernButton variant="danger" onClick={handlePurge}>
          <DeleteIcon />
          PURGE ALL USERS
        </ModernButton>
      </div>

      <TableSection>
        <TableHeader>
          <h3>Anonymous Users ({users.length})</h3>
        </TableHeader>
        <TableContainer>
          <ModernTable>
            <ModernTableHead>
              <tr>
                <th>Anonymous User ID</th>
                <th>Nickname</th>
                <th>Survey Status</th>
                <th>Completion Status</th>
                <th>Feedback</th>
                <th>TPMS</th>
                <th>Actions</th>
              </tr>
            </ModernTableHead>
            <tbody>
              {users.length > 0 ? (
                users.map(user => (
                  <React.Fragment key={user.anonymous_user_id}>
                    <CustomTableRow status={`${user.surveyStatus}, ${user.completionStatus}`} isSpam={user.isSpam}>
                      <CustomTableCell>
                        {user.anonymous_user_id}
                        {user.isSpam && (
                          <SpamBadge title="This user exhibits behavior patterns consistent with spam">
                            <RobotIcon style={{ fontSize: '14px', marginRight: '4px' }} />
                            SUSPECTED SPAM⚠️
                          </SpamBadge>
                        )}
                      </CustomTableCell>
                      <CustomTableCell>
                        {user.nickname || 'Anonymous'}
                      </CustomTableCell>
                      <CustomTableCell>
                        {user.surveyStatus}
                        {user.isSpam && user.surveyStatus === 'HAS NO SURVEY' && (
                          <SpamBadge style={{ animation: 'none', background: '#f6ad55' }}>
                            NO DATA
                          </SpamBadge>
                        )}
                      </CustomTableCell>
                      <CustomTableCell>
                        <span style={{ 
                          color: user.completionStatus === 'HAS COMPLETED' ? '#48bb78' : '#f56565',
                          fontWeight: '500'
                        }}>
                          {user.completionStatus}
                        </span>
                      </CustomTableCell>
                      <CustomTableCell feedback={user.feedback ? 'Yes' : 'No'}>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          {user.feedback ? <CheckIcon style={{ color: '#48bb78', marginRight: '4px' }} /> : <CancelIcon style={{ color: '#f56565', marginRight: '4px' }} />}
                          {user.feedback ? 'Yes' : 'No'}
                        </span>
                      </CustomTableCell>
                      <CustomTableCell>
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                          {user.tpms ? <CheckIcon style={{ color: '#48bb78', marginRight: '4px' }} /> : <CancelIcon style={{ color: '#f56565', marginRight: '4px' }} />}
                          {user.tpms ? 'Yes' : 'No'}
                        </span>
                      </CustomTableCell>
                      <CustomTableCell>
                        <ActionButtonGroup>
                          <ActionButton variant="edit" onClick={() => toggleDetails(user.anonymous_user_id)}>
                            {detailsVisible === user.anonymous_user_id ? 'HIDE DETAILS' : 'SHOW DETAILS'}
                          </ActionButton>
                        </ActionButtonGroup>
                      </CustomTableCell>
                    </CustomTableRow>
                    {detailsVisible === user.anonymous_user_id && (
                      <CustomTableRow>
                        <CustomTableCell colSpan="7">
                          <DetailsContainer>
                            <h4>Survey Responses for {user.nickname || 'Anonymous User'}</h4>
                            {user.isSpam && (
                              <SpamWarningBanner>
                                <WarningIcon style={{ marginRight: '8px' }} />
                                <span>WARNING: This user has been flagged as likely spam based on behavior patterns.</span>
                              </SpamWarningBanner>
                            )}
                            {user.surveyEntries.length > 0 ? (
                              Object.entries(groupResponsesByTitle(user.surveyEntries)).map(([title, responses]) => (
                                <GroupedDetails key={title}>
                                  <GroupTitle>{title}</GroupTitle>
                                  {responses.map((response, index) => {
                                    const matchingQuestion = surveyQuestions.find(
                                      question => question.surveyresponses_ref === response.surveyquestion_ref
                                    );

                                    return (
                                      <ResponseItem key={index}>
                                        <ResponseText>
                                          <strong>Question:</strong> {matchingQuestion?.content || 'N/A'} <br />
                                          <strong>Response:</strong> {response.response_value}
                                        </ResponseText>
                                        <Timestamp>
                                          {new Date(response.created_at).toLocaleString()}
                                        </Timestamp>
                                      </ResponseItem>
                                    );
                                  })}
                                </GroupedDetails>
                              ))
                            ) : (
                              <EmptyState>
                                <div className="icon">
                                  <PersonIcon />
                                </div>
                                <h4>No survey responses found</h4>
                                <p>This user has not completed any survey responses yet.</p>
                              </EmptyState>
                            )}
                          </DetailsContainer>
                        </CustomTableCell>
                      </CustomTableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <CustomTableCell colSpan="7">
                    <EmptyState>
                      <div className="icon">
                        <PersonIcon />
                      </div>
                      <h4>No users found</h4>
                      <p>No anonymous users have been created yet.</p>
                    </EmptyState>
                  </CustomTableCell>
                </tr>
              )}
            </tbody>
          </ModernTable>
        </TableContainer>
      </TableSection>
    </ModernContainer>
  );
};

export default AnonymousUsersHandler;