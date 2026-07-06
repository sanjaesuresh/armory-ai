import type { ComparisonTableBlock as ComparisonTableBlockData } from '@/lib/learn/types';

/**
 * ComparisonTableBlock — a caption-free small table with column headers. Static.
 * The first column is emphasized via CSS (.comparison-tbl td:first-child).
 */
export default function ComparisonTableBlock({ block }: { block: ComparisonTableBlockData }) {
  return (
    <section className="lblock">
      <div className="comparison-tbl-wrap">
        <table className="comparison-tbl">
          <thead>
            <tr>
              {block.headers.map((header, i) => (
                <th key={i} scope="col">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td key={ci}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
