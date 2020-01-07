import * as React from 'react';

type CreateUserViewProps = {};

type CreateUserViewState = {
    username: string;
    password: string;
};

export class CreateUserView extends React.Component<
    CreateUserViewProps,
    CreateUserViewState
> {
    constructor(props: CreateUserViewProps) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }

    usernameOnChange(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            username: event.target.value
        });
    }
    passwordOnChange(event: React.ChangeEvent<HTMLInputElement>): void {
        this.setState({
            password: event.target.value
        });
    }

    createUser(event: React.FormEvent<HTMLFormElement>): void {
        event.preventDefault();

        fetch('/api/v1/users', {
            method: 'post',
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            }),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then((...args) => {
            console.log('test', args);
        });
    }

    render() {
        return (
            <form onSubmit={event => this.createUser(event)}>
                <legend>Create User:</legend>
                <p>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={this.state.username}
                        onChange={event => this.usernameOnChange(event)}
                    />
                </p>

                <p>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={event => this.passwordOnChange(event)}
                    />
                </p>

                <button type="submit">Submit</button>
            </form>
        );
    }
}
