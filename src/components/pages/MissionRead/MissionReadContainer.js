import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { getStory } from '../../../api';
import RenderMissionRead from './RenderMissionRead';
// Recoil imports
import { useSetRecoilState, useRecoilValue } from 'recoil';
import { headerTitle } from '../../../state/headerTitle';
import { currentUserState } from '../../../state/userState';

const MissionReadContainer = () => {
  // Header Title
  const setHeaderTitle = useSetRecoilState(headerTitle);
  // User details for API calls
  const { curUserId, curUserToken } = useRecoilValue(currentUserState);
  // Callback to push user to correct URL
  const { push } = useHistory();
  // URL to the PDF of the story to display
  const [story, setStory] = useState('');
  // holds the current page of the PDF to display
  const [page, setPage] = useState(1);
  // state to track when a user has read the whole story
  const [readingDone, setReadingDone] = useState(false);

  // API call to get the PDF story
  useEffect(() => {
    getStory(curUserToken, curUserId)
      .then(res => {
        setStory(res.data.read);
      })
      .catch(err => console.log({ err }));
  }, [curUserToken, curUserId]);

  // sets the header title
  useEffect(() => {
    setHeaderTitle('Ready, Set... Read!');
  }, [setHeaderTitle]);

  // returns user to mission dashboard once story is read
  const missionComplete = e => {
    e.preventDefault();
    // push back to mission dash
    push('/mission');
  };

  // checks story progress and displays button after story is complete
  const checkProgress = (e, pageNum, lastPage) => {
    e.preventDefault();
    // advance the page num
    setPage(page + 1);

    // on each click check to see if we have reached the end
    if (pageNum + 1 === lastPage) {
      setReadingDone(true);
    }
  };

  return (
    <RenderMissionRead
      story={story}
      page={page}
      setPage={setPage}
      readingDone={readingDone}
      setReadingDone={setReadingDone}
      checkProgress={checkProgress}
      missionComplete={missionComplete}
    />
  );
};

export default MissionReadContainer;
