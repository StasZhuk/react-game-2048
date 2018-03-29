import React, { Component } from 'react';

export default class Button extends Component {
    render() {
        return (
            <div>
                <button value={this.props.value} onClick={this.props.onClick}>
                    {this.props.value}
                </button>
            </div>
        );
    }
}