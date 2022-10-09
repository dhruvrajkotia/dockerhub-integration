import Mixpanel from "mixpanel"
export let mixpanel: Mixpanel.Mixpanel;

export const initMixpanel = () => {
    const { MIXPANEL_TOKEN } = process.env

    if (!MIXPANEL_TOKEN) {
        throw 'Missing env related to Mixpanel'
    }

    mixpanel = Mixpanel.init(MIXPANEL_TOKEN);
}
