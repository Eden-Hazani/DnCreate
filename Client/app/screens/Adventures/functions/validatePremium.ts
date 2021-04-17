import authApi from "../../../api/authApi";

const validatePremium = async (DM_id: string) => {
    const result = await authApi.isPremium(DM_id);
    if (result.data === 'false') {
        return 'MEMBER_ERROR'
    }
    return 'OK'
}

export default validatePremium