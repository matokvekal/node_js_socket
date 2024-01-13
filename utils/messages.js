// import moment from 'moment';

// function formatMessage(username, text) {
//   return {
//     username,
//     text,
//     time: moment().format('h:mm a')
//   };
// }
// export default formatMessage;

import moment from 'moment';

class MessageFormatter {
    constructor(botName) {
        this.botName = botName;
    }

    formatMessage(username, text) {
        return {
            username,
            text,
            time: moment().format('h:mm a')
        };
    }
}

export default MessageFormatter;
