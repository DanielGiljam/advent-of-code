fn get_variants(input: &str) -> String {
    let rows = input
        .lines()
        .map(|line| line.trim().chars().collect())
        .collect::<Vec<Vec<char>>>();
    dbg!(&rows);
    let x_len = rows[0].len();
    let y_len = rows.len();
    let mut cols = vec![vec![]; x_len];
    let mut diags = vec![vec![]; x_len + y_len - 1];
    let mut anti_diags = vec![vec![]; x_len + y_len - 1];
    for (y, row) in rows.iter().enumerate() {
        for (x, &c) in row.iter().enumerate() {
            cols[x].push(c);
            diags[x + y].push(c);
            anti_diags[y_len + x - y - 1].push(c);
        }
    }
    dbg!(&cols);
    dbg!(&diags);
    dbg!(&anti_diags);
    [cols, diags, anti_diags]
        .iter()
        .flat_map(|diags| diags.iter().map(|row| row.iter().collect::<String>()))
        .collect::<Vec<String>>()
        .join("\n")
}

#[tracing::instrument]
pub fn process(input: &str) -> miette::Result<String> {
    let input_variants = get_variants(input);
    let regex = regex::Regex::new(r"XMAS").unwrap();
    let mut count = 0;
    count += regex.captures_iter(input).count();
    count += regex.captures_iter(&input_variants).count();
    count += regex
        .captures_iter(&input.chars().rev().collect::<String>())
        .count();
    count += regex
        .captures_iter(&input_variants.chars().rev().collect::<String>())
        .count();
    Ok(count.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_process() -> miette::Result<()> {
        let input = "MMMSXXMASM
                           MSAMXMSMSA
                           AMXSXMAAMM
                           MSAMASMSMX
                           XMASAMXAMM
                           XXAMMXXAMA
                           SMSMSASXSS
                           SAXAMASAAA
                           MAMMMXMMMM
                           MXMXAXMASX";
        assert_eq!("18", process(input)?);
        Ok(())
    }
}
