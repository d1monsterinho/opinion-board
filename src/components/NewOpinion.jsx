import {use, useActionState, useState} from 'react';
import {OpinionsContext} from "../store/opinions-context.jsx";
import Submit from "./Submit.jsx";

export function NewOpinion() {
    const [isAddingOpinionInProcess, setIsAddingOpinionInProcess] = useState(false);
    const [actionState, actionHandler, isPending] = useActionState(handleNewOpinionAction, {errors: null});
    const {addOpinion} = use(OpinionsContext);

    async function handleNewOpinionAction(prevActionState, formData) {
        const userName = formData.get('userName');
        const title = formData.get('title');
        const body = formData.get('body');

        const errors = [];

        if (userName.trim().length === 0) errors.push('Username must not be empty');
        if (title.trim().length === 0) errors.push('Title must not be empty');
        if (body.trim().length === 0) errors.push('This is not an opinion...');

        if (errors.length > 0) {
            return {
                errors,
                enteredValues: {
                    userName,
                    title,
                    body,
                }
            }
        }

        await addOpinion({
            userName,
            title,
            body,
        });

        return {
            errors: null,
        }
    }

    return (
        <div id="new-opinion">
            <h2>Share your opinion!</h2>
            <form action={actionHandler}>
                <div className="control-row">
                    <p className="control">
                        <label htmlFor="userName">Your Name</label>
                        <input
                            type="text"
                            id="userName"
                            name="userName"
                            defaultValue={actionState.enteredValues?.userName}
                        />
                    </p>

                    <p className="control">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            defaultValue={actionState.enteredValues?.title}
                        />
                    </p>
                </div>
                <p className="control">
                    <label htmlFor="body">Your Opinion</label>
                    <textarea
                        id="body"
                        name="body"
                        rows={5}
                        defaultValue={actionState.enteredValues?.body}
                    ></textarea>
                </p>

                {actionState.errors && (
                    <div className="errors">
                        <ul>
                            {actionState.errors.map(error => (
                                <li key={error}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <Submit />
            </form>
        </div>
    );
}
