"use client"

import { gql, useQuery } from "@apollo/client"

/**
 * Query to inspect a GraphQL type's fields
 */
export const INSPECT_TYPE = gql`
  query InspectType($typeName: String!) {
    __type(name: $typeName) {
      name
      kind
      fields {
        name
        type {
          name
          kind
          ofType {
            name
            kind
          }
        }
      }
    }
  }
`

/**
 * Hook to inspect a GraphQL type's fields
 * @param typeName The name of the type to inspect
 */
export function useInspectType(typeName: string) {
  return useQuery(INSPECT_TYPE, {
    variables: { typeName },
    fetchPolicy: "network-only",
  })
}

/**
 * Component to display a type's fields
 */
export function SchemaInspector({ typeName }: { typeName: string }) {
  const { data, loading, error } = useInspectType(typeName)

  if (loading) return <div>Loading schema information...</div>
  if (error) return <div>Error loading schema: {error.message}</div>
  if (!data?.__type) return <div>Type {typeName} not found in schema</div>

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl font-bold mb-2">Type: {data.__type.name}</h2>
      <h3 className="text-lg font-semibold mb-2">Fields:</h3>
      <ul className="list-disc pl-5">
        {data.__type.fields?.map((field: any) => (
          <li key={field.name} className="mb-1">
            <span className="font-medium">{field.name}</span>:{" "}
            <span className="text-gray-600">{field.type.name || field.type.ofType?.name || field.type.kind}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

