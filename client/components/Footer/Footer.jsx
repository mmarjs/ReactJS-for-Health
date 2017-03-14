import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';
import css from './footer.css';

class Footer extends React.Component {
    render() {
        return (
            <footer>
                <Grid fluid={true} style={{paddingLeft: 0, paddingRight: 0}}>
                    <Row>
                        <Col xs={12}>
                            <div className={css.footer}>
                                © 2017 All rights reserved. Viven Health, Inc.
                            </div>
                        </Col>
                    </Row>
                </Grid>
            </footer>
        );
    }
}

export default Footer;