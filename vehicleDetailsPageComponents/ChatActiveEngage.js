import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import renderIfActive from 'hocs/renderIfActive';

@renderIfActive
export default class ChatActiveEngage extends PureComponent {
    static propTypes = {
        dealer_id: PropTypes.number,
    };

    static defaultProps = {
        dealer_id: null,
    };

    componentDidMount() {
        this.setScriptToHead();
    }

    componentWillUnmount() {
        this.removeScriptFromHead();
    }

    setScriptToHead = () => {
        if (!document.getElementById('activeEngageConfig') && !document.getElementById('activeEngageScript')) {
            const { dealer_id } = this.props;
            const head = document.head;
            const config = document.createElement('script');
            const script = document.createElement('script');

            config.innerHTML = `ActivEngageConfig = { location: "http://${dealer_id}.url.com" }`;
            config.id = 'activeEngageConfig';

            script.async = true;
            script.src='https://go.activengage.com/1.js';
            script.id = 'activeEngageScript';

            head.appendChild(config);
            head.appendChild(script);
        }
    };

    removeScriptFromHead = () => {
        const head = document.head;
        // TODO: will be uncommented when feature wil be finished
        // const body = document.body;

        const config = document.getElementById('activeEngageConfig');
        const script = document.getElementById('activeEngageScript');
        // TODO: will be uncommented when feature wil be finished
        // const activEngageInvite = document.getElementById('ActivEngageInvite');

        if (config) head.removeChild(config);
        if (script) head.removeChild(script);
        // TODO: will be uncommented when feature wil be finished
        // if (activEngageInvite) body.removeChild(activEngageInvite);
    };

    render() {
        const { dealer_id } = this.props;
        // TODO: will be uncommented when feature wil be finished
        // return <div id={`ChatLoc_${dealer_id}`} />;
        return <div id="ChatLoc_82" />;
    }
}

