import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { messagePopup } from '../../../utils/message-popup';
import RenderMissionDash from './RenderMissionDash';

import { useRecoilState, useSetRecoilState } from 'recoil';
import { headerTitle } from '../../../state/headerTitle';
import { currentUserState } from '../../../state/userState';
import { getData } from '../../../api';

const MissionDashContainer = () => {
  // Header title
  const setHeaderTitle = useSetRecoilState(headerTitle);
  // mission progress used to control checkbox images and restrict access to missions in order
  const [curUser, setCurUser] = useRecoilState(currentUserState);
  const { curUserId, curUserType } = curUser;
  const missionReqs = curUser.missionProgress;
  const refMissionReqs = useRef(curUser.missionProgress);
  // Calback to push user to correct URL
  const { push } = useHistory();

  // Whenever this component mounts update the <Header /> title
  useEffect(() => {
    setHeaderTitle('Mission');
  }, [setHeaderTitle]);

  useEffect(() => {
    getData(`/${curUserType}/${curUserId}/progress`)
      .then(res => {
        const { read, write, draw } = res.data.progress;
        setCurUser({
          ...curUser,
          missionProgress: {
            ...refMissionReqs.current,
            read,
            write,
            draw,
          },
        });
      })
      .catch(err => {
        console.log(err);
      });
  }, [curUser, curUserId, curUserType, setCurUser]);

  // Checks if mission requirements have been met and then pushes
  // to mission URL or displays message popup with the requirements
  const beginMission = (mission, missionURL, message) => {
    switch (mission) {
      case 'read':
        push(missionURL);
        break;

      case 'write':
        missionReqs.read
          ? push(missionURL)
          : messagePopup('warning', message, 'Mission Locked!');
        break;

      case 'draw':
        missionReqs.write
          ? push(missionURL)
          : messagePopup('warning', message, 'Mission Locked!');
        break;

      default:
        break;
    }
  };

  return (
    <RenderMissionDash beginMission={beginMission} missionReqs={missionReqs} />
  );
};

export default MissionDashContainer;
