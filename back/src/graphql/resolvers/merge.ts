import { dateToString } from '../../helpers';
import { IModel } from '../../interfaces';

const addTimeStamp = (model: IModel) => {
    return ({
        ...model._doc,
        _id: model.id,
        createdAt: dateToString(model._doc.createdAt),
        updatedAt: dateToString(model._doc.updatedAt)
    });
}

export { addTimeStamp };
