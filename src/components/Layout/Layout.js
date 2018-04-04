import React, { Component } from 'react';
import styled from 'styled-components';

class Layout extends Component {
    render() {
        return (
            <Container>
                {this.props.children}
            </Container>
        );
    }
}

export default Layout;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    overflow: hidden;
`