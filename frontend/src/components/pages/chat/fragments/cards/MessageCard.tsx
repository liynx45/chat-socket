import React, { useEffect, useState } from 'react'
import { useSession } from '@providers/AuthProvider';
import { MsgType, useChat } from '@contexts/chat/ChatContext';
import { colors } from '../../../../../constants/color';
import MessageCardListMenu from '../listMenu/MessageCardListMenu';
import Cheked from './Cheked';
import { useSelectMessage } from '@contexts/chat/message/SelectMessageContext';
import { getHourTime } from '@utils/timeNotif';
import { useSearchMessage } from '@contexts/chat/message/SearchMessagteContext';
import Icon from '../../../../../constants/icons';

const brightColors = [
    "#FF5733", // Bright Red-Orange
    "#FF8D33", // Bright Orange
    "#FFC133", // Bright Yellow-Orange
    "#FFF333", // Bright Yellow
    "#B6FF33", // Bright Lime Green
    "#33FF57", // Bright Green
    "#33FF8D", // Bright Green-Cyan
    "#33FFC1", // Bright Cyan
    "#33FFF3", // Bright Cyan-Blue
    "#33C1FF", // Bright Blue
    "#338DFF", // Bright Blue-Purple
    "#5733FF", // Bright Purple
    "#8D33FF", // Bright Purple-Magenta
    "#C133FF", // Bright Magenta
    "#F333FF", // Bright Pink
    "#FF33C1", // Bright Pink-Magenta
    "#FF338D", // Bright Red-Pink
    "#FF3357"  // Bright Red
];

function MessageCard({
    data
}: {
    data: MsgType
}) {

    const [tglList, setTglList] = useState(false);
    const [fade, setfade] = useState(true);
    const { select, fn: { handleSelect } } = useSelectMessage();
    const { user } = useSession();
    const { current } = useChat();
    const { fn: { handleRefClick } } = useSearchMessage();

    function assignBrightColors(strings: string) {
        return strings.split("").map((str, index) => {
            const colorIndex = index % brightColors.length;
            const firstChar = str.charAt(0);
            const assignedColor = brightColors[colorIndex];
            return { char: firstChar, color: assignedColor };
        });
    }

    // const userColor = assignBrightColors(data.info_msg.from)?
    // console.log(assignBrightColors);
    
    


    useEffect(() => {
        const fadeAnimation = setTimeout(() => setfade(false), 200)

        return () => {
            clearTimeout(fadeAnimation)
        }
    }, [])

    const getExistForward = select.data.find(msg => msg.id === data.id) ? true : false;

    return (
        <div
            id={data.id}
            onClick={() => select.status ? handleSelect(data) : null}
            className={`w-full relative flex my-2 text-white ${getExistForward && "bg-bg-primary"} ${select.data.length >= 1 && "cursor-pointer"}`}
            style={{
                justifyContent: data.info_msg.from === user.username ? "flex-end" : "flex-start",
                opacity: fade ? "0" : "1"
            }}
        >


            {
                //  Action select.data if message exist on select.data array and msg from same xurrent user 
                select.status && data.info_msg.from !== user.username && (
                    <Cheked value={getExistForward} />
                )
                // Action select.data if message exist on select.data array
            }



            {
                data.info_msg.from !== user.username && current?.type === "group" &&
                <span className="w-[40px] h-[40px] mt-3 rounded-full flex justify-center items-center mr-3 bg-gray-500" >{data.info_msg.from.charAt(0).toUpperCase()}</span>
            }



            {/* Outer container message start */}
            <div>


                {/* Message Body Start */}
                <div
                    className={`${data.info_msg.from === user.username ? "bg-green-primary" : "bg-hover-color"} flex flex-col py-1 px-1 max-w-[36rem] group `}
                    style={{
                        position: "relative",
                        borderRadius: user.username === data.info_msg.from ? "8px 8px 0" : "8px 8px 8px 0px"
                    }}
                >
                    {
                        data.forward && data.info_msg.from !== user.username && (
                            <div className='h-6 flex gap-1 italic px-1'>
                                {Icon.corner_right({
                                    color: colors.ICON_COLOR,
                                    size: 20
                                })}
                                <p className='text-sm text-icon-color'>Diteruskan</p>
                            </div>
                        )
                    }
                    {
                        current?.type === "group" && data.info_msg.from !== user.username && (
                            <h5
                                style={{
                                    textAlign: data.info_msg.from === user.username ? "right" : 'left',
                                    color: ""
                                }}
                                className={`ml-1 text-sm`}
                            >
                                {data.info_msg.from === user.username ? "You" : data.info_msg.from}
                            </h5>
                        )
                    }


                    {/* Toggle list message menu button start */}
                    {
                        select.data.length === 0 && (
                            <button
                                onClick={() => setTglList(pv => !pv)}
                                className={`absolute right-0 shadow-lg top-0 hidden rounded-full ${user.username === data.info_msg.from ? "bg-green-primary" : "bg-hover-color"} hidden group-hover:flex`}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width={30}
                                    height={30}
                                    id="angle-bottom-b">
                                    <path
                                        fill={colors.ICON_COLOR}
                                        d="M17,9.17a1,1,0,0,0-1.41,0L12,12.71,8.46,9.17a1,1,0,0,0-1.41,0,1,1,0,0,0,0,1.42l4.24,4.24a1,1,0,0,0,1.42,0L17,10.59A1,1,0,0,0,17,9.17Z"
                                    >
                                    </path>
                                </svg>
                            </button>
                        )
                    }
                    {/* Toggle list message menu button start */}


                    {/* Modal List menu message start*/}
                    {
                        tglList && (
                            <div className={`absolute ${data.info_msg.from !== user.username ? "left-full ml-2" : "right-full mr-2"}`}>
                                <div className='fixed top-0 z-10 left-0 min-h-screen w-full' onClick={() => setTglList(pv => !pv)}></div>
                                <MessageCardListMenu
                                    msg={data}
                                    setTgl={setTglList}
                                />
                            </div>
                        )
                    }
                    {/* Modal List menu message End*/}





                    {/* Message Reply Cards start */}
                    {
                        data.pull_msg && (
                            <div style={{
                                padding: 6,
                                marginBottom: 3,
                                borderRadius: 6,
                            }}
                                onClick={() => handleRefClick(data.pull_msg?.id!)}
                                className='bg-green-secondary rounded-2xl border-l-4 border-green-accent'
                            >
                                {/* {
                                    data.fwd && data.fwd !== current && <span style={{ color: "red" }}>Terusan</span>
                                } */}
                                <h6
                                    style={{ marginBottom: 4 }}
                                    className='text-green-accent'
                                >
                                    {data.pull_msg.info_msg.from === user.username ? "Kamu" : data.pull_msg.info_msg.from}
                                </h6>
                                <p>{data.pull_msg.msg}</p>
                            </div>
                        )
                    }
                    {/* Message Reply Cards End */}



                    {/* Message content */}
                    <div className='flex w-full items-end gap-2'>
                        <p className='px-1 w-full pb-2'>{data.msg}</p>
                        <span
                            style={{
                                textAlign: data.info_msg.from === user.username ? "right" : "left"
                            }}
                            className='text-icon-color text-[12px] w-fit px-1'
                        >
                            {getHourTime(data.time)}
                        </span>
                    </div>
                    {/* Message content */}


                </div>
                {/* Message Body End */}


            </div>
            {/* Outer container message end */}



            {
                //  Action select.data if message exist on select.data array and msg from not equal xurrent user 
                select.status && data.info_msg.from === user.username && (
                    <Cheked value={getExistForward} />
                )
                //  Action select.data if message exist on select.data array 
            }


        </div>
    )
}

export default MessageCard
