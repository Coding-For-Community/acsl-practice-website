import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import '@mantine/core/styles.css';
import { AppShell, Burger, Group, MultiSelect, Select, Stack, Text, Title } from '@mantine/core';

function App() {
  const [contests, setContests] = useState<string[]>([])

  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: 'sm'
        }}
        padding="md"
      >
        <AppShell.Header>
          <Group mt={15} ml={10} gap={10}>
            <Title order={3}>CA ACSL practice website</Title>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <MultiSelect 
            label="Choose Contests" 
            data={["Contest 1", "Contest 2", "Contest 3", "Contest 4"]}
            value={contests}
            onChange={setContests} 
            mb={15}
          />

          <Select 
            label="Choose division"
            data={["Senior", "Intermediate"]}
          />

        </AppShell.Navbar>

        <AppShell.Main>
          <Text>There are bla bla bla and bla. How does this work? sdfdsfsdfsdfdsfsfdffdefdfdfffdfdfdfdfdfdf</Text>
        </AppShell.Main>
      </AppShell>
    </>
  )
}

export default App
