"use client";

import { useState } from "react";
import { ApolloClient, InMemoryCache, gql, useQuery } from '@apollo/client';

import { Select, SelectItem } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import { Spinner } from "@nextui-org/react";


// initialize a GraphQL client
const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: 'https://countries.trevorblades.com'
});

export default function Home() {
  const [continent, setContinent] = useState('AS');
  const handleSelectionChange = (e) => {
    console.log(e.target.value);
    setContinent(e.target.value);
  };

  const LIST_CONTINENTS = gql`
  {
    continents {
      name
      code
    }
  }
`;

  const LIST_COUNTRIES = gql`
  {
    countries(filter: {
      continent: { eq: "${continent}" }
    }) {
      name
      code
      phone
      capital
      emoji
      currency
    }
}
`;

  // Fetching data
  const { data: continentsData, loading: continentsLoading, error: continentsError } = useQuery(LIST_CONTINENTS, { client });
  const { data: countriesData, loading: countriesLoading, error: countriesError } = useQuery(LIST_COUNTRIES, { client });

  if (continentsLoading || continentsError || countriesError) {
    return (
      <div className="flex justify-center mt-[20rem]">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <div className="w-xl flex-col mt-8">
        <p className="text-xl font-bold">Continents Explorer</p>
        <div className=" w-full justify-center items-center flex-wrap md:flex-nowrap mb-5">
          <Select
            label="Select an Continents"
            labelPlacement={"outside"}
            placeholder="Asia"
            className="max-w-xs"
            onChange={handleSelectionChange}
          >
            {continentsData.continents.map((continents) => (
              <SelectItem key={continents.code} value={continents.code} >
                {continents.name}
              </SelectItem>
            ))}
          </Select>
        </div>

        <div className="w-xl">
          <Table classNames={{
            wrapper: "max-h-[600px]",
            base: "w-[600px]"
          }}>
            <TableHeader>
              <TableColumn>Flag</TableColumn>
              <TableColumn>Name</TableColumn>
              <TableColumn>Capital</TableColumn>
              <TableColumn>Phone</TableColumn>
              <TableColumn>Currency</TableColumn>
              <TableColumn>Emoji</TableColumn>
            </TableHeader>

            {/* Show Empty Table if Country Data is Loading */}
            {countriesLoading ? (
              <TableBody emptyContent={"Loading"}>{[]}</TableBody> ) : (
              <TableBody>
                {countriesData.countries.map((country) => (
                  <TableRow key={country.code}>
                    <TableCell>
                      <img
                        src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w40/${country.code.toLowerCase()}.png 2x`}
                        width="20"
                        alt={country.name}
                      />
                    </TableCell>
                    <TableCell>{country.name}</TableCell>
                    <TableCell>{country.capital ? country.capital : "N/A"}</TableCell>
                    <TableCell>+{country.phone}</TableCell>
                    <TableCell>{country.currency ? country.currency.split(",")[0] : "N/A"}</TableCell>
                    <TableCell>{country.emoji}</TableCell>
                  </TableRow>
                ))}
              </TableBody>) }
          </Table>
        </div>
      </div>
    </div >
  );
}
