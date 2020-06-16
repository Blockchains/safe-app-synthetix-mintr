import React from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import { Text, Title } from '@gnosis.pm/safe-react-components';

const StyledGrid = styled(Grid)`
  margin-bottom: 24px;
`;

const StyledTitle = styled(Title)`
  text-transform: uppercase;
  font-size: 1.7rem;
  color: #008C73;
  margin-top:10px;
`;

const StyledText = styled(Text)`
  font-size: .9rem;
  color: #333333;
`;

type Props = {
  icon: any;
  name: string;
  description: string;
};

function Section({ icon, name, description }: Props) {
  return (
    <StyledGrid container>
      <Grid item xs={6} sm={3}>
        {icon}
      </Grid>
      <Grid item xs={6} sm={3}>
        <StyledTitle size="lg">{name}</StyledTitle>
      </Grid>
      <Grid item xs={12} sm={6}>
        <StyledText size="lg">{description}</StyledText>
      </Grid>
    </StyledGrid>
  );
}

export default Section;
