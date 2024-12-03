#[tracing::instrument]
pub fn process(input: &str) -> miette::Result<String> {
    let regex = regex::Regex::new(r"(?:mul\((\d+),(\d+)\)|do\(\)|don't\(\))").unwrap();
    let mut enabled = true;
    let sum = regex
        .captures_iter(input)
        .map(|m| {
            let do_or_dont = m.get(0).unwrap().as_str();
            if do_or_dont == "do()" {
                enabled = true;
                return 0;
            }
            if do_or_dont == "don't()" {
                enabled = false;
                return 0;
            }
            if !enabled {
                return 0;
            }
            let a = m.get(1).unwrap().as_str().parse::<usize>().unwrap();
            let b = m.get(2).unwrap().as_str().parse::<usize>().unwrap();
            a * b
        })
        .sum::<usize>();
    Ok(sum.to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_process() -> miette::Result<()> {
        let input = "xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))";
        assert_eq!("48", process(input)?);
        Ok(())
    }
}
